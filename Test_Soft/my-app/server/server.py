import sqlite3
import json
import threading
import logging
import sys
from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import tkinter as tk
from tkinter import ttk
from jsonschema import validate, ValidationError
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import (
    JWTManager, create_access_token,
    jwt_required, get_jwt_identity
)

# Ensure UTF-8 output
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

# Logging setup
logging.getLogger('werkzeug').setLevel(logging.ERROR)
logger = logging.getLogger()
logger.setLevel(logging.DEBUG)
for h in list(logger.handlers):
    logger.removeHandler(h)
fmt = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
fh = logging.FileHandler("server.log", encoding="utf-8")
fh.setFormatter(fmt)
sh = logging.StreamHandler()
sh.setFormatter(fmt)
logger.addHandler(fh)
logger.addHandler(sh)


# Flask + CORS + JWT
app = Flask(__name__)
CORS(app)  # will add appropriate Allow-Origin, Allow-Methods etc.
app.config["JWT_SECRET_KEY"] = "CHANGE_THIS_TO_A_STRONG_SECRET"
jwt = JWTManager(app)
# imediat după jwt = JWTManager(app)
socketio = SocketIO(app, cors_allowed_origins="*")

DATABASE = "database.sqlite"

# JSON schemas
data_schema = {
    "type": "object",
    "properties": {
        "esp_id": {"type": "string"},
        "mac": {"type": "string"},
        "sensors": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "sensor_id": {"type": "string"},
                    "type": {"type": "string"},
                    "values": {"type": "object"}
                },
                "required": ["sensor_id", "type", "values"]
            },
            "minItems": 1
        }
    },
    "required": ["esp_id", "mac", "sensors"]
}

connected_devices_schema = {
    "type": "object",
    "properties": {
        "esp_id": {"type": "string"},
        "mac": {"type": "string"},
        "connected_devices": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "type": {"type": "string"},
                    "interact": {"type": "boolean"}
                },
                "required": ["type", "interact"]
            },
            "minItems": 1
        }
    },
    "required": ["esp_id", "mac", "connected_devices"]
}

def get_db_connection():
    logging.debug("Opening DB connection")
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def create_tables():
    logging.info("Creating tables if not exist")
    conn = get_db_connection()
    c = conn.cursor()
    try:
        c.execute("""
            CREATE TABLE IF NOT EXISTS devices (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              esp_id TEXT UNIQUE NOT NULL,
              mac TEXT,
              user_id INTEGER,
              last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY(user_id) REFERENCES users(id)
            )
        """)
        c.execute("""
            CREATE TABLE IF NOT EXISTS sensor_readings (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              device_id INTEGER,
              sensor_id TEXT,
              sensor_type TEXT,
              sensor_values TEXT,
              timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY(device_id) REFERENCES devices(id)
            )
        """)
        c.execute("""
            CREATE TABLE IF NOT EXISTS connected_devices (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              esp_id TEXT NOT NULL,
              device_type TEXT,
              interact BOOLEAN NOT NULL,
              last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        c.execute("""
            CREATE TABLE IF NOT EXISTS users (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              username TEXT UNIQUE NOT NULL,
              password TEXT NOT NULL
            )
        """)
        conn.commit()
    except Exception as e:
        logging.error("Error creating tables: %s", e)
    finally:
        conn.close()

def get_device_id(esp_id, mac):
    logging.debug("get_device_id for %s", esp_id)
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("SELECT id FROM devices WHERE esp_id = ?", (esp_id,))
    row = c.fetchone()
    if row:
        device_id = row["id"]
        c.execute("UPDATE devices SET mac = ? WHERE id = ?", (mac, device_id))
        logging.info("Updated MAC for %s", esp_id)
    else:
        c.execute("INSERT INTO devices (esp_id, mac) VALUES (?, ?)", (esp_id, mac))
        device_id = c.lastrowid
        logging.info("Inserted new device %s", esp_id)
    conn.commit()
    conn.close()
    return device_id

# Log each request
@app.before_request
def log_req():
    logging.info("%s - %s %s", request.remote_addr, request.method, request.path)

# -------- Authentication --------
@app.route("/register", methods=["OPTIONS", "POST"])
def register():
    if request.method == "OPTIONS":
        # CORS preflight handled by flask-cors
        return make_response("", 204)
    data = request.get_json() or {}
    logging.debug("Register payload: %s", data)
    u = data.get("username")
    p = data.get("password")
    cp = data.get("confirmPassword")
    if not u or not p:
        return jsonify(error="username_and_password_required"), 400
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("SELECT id FROM users WHERE username = ?", (u,))
    if c.fetchone():
        conn.close()
        return jsonify(error="user_already_exists"), 400
    if p != cp:
        conn.close()
        return jsonify(error="passwords_do_not_match"), 400
    pw = generate_password_hash(p)
    c.execute("INSERT INTO users (username, password) VALUES (?, ?)", (u, pw))
    conn.commit()
    conn.close()
    token = create_access_token(identity=u)
    return jsonify(token=token), 201

@app.route("/login", methods=["OPTIONS", "POST"])
def login():
    if request.method == "OPTIONS":
        return make_response("", 204)
    data = request.get_json() or {}
    logging.debug("Login payload: %s", data)
    u = data.get("username")
    p = data.get("password")
    if not u or not p:
        return jsonify(error="username_and_password_required"), 400
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("SELECT password FROM users WHERE username = ?", (u,))
    row = c.fetchone()
    conn.close()
    if not row or not check_password_hash(row["password"], p):
        return jsonify(error="invalid_credentials"), 401
    token = create_access_token(identity=u)
    return jsonify(token=token), 200

@app.route("/profile", methods=["GET"])
@jwt_required()
def profile():
    user = get_jwt_identity()
    logging.info("/profile called by %s", user)
    return jsonify(username=user), 200

@app.route('/dashboard', methods=['GET'])
@jwt_required()
def dashboard():
    # 1. Cine e user-ul curent?
    current_user = get_jwt_identity()

    # 2. Ia ID-ul numeric al user-ului
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT id FROM users WHERE username = ?", (current_user,))
    user_row = cur.fetchone()
    if not user_row:
        conn.close()
        return jsonify(error="user_not_found"), 404
    user_id = user_row["id"]

    # 3. Colectează toate ESP-urile din devices care au user_id = current user
    cur.execute("""
        SELECT esp_id, mac, last_update
          FROM devices
         WHERE user_id = ?
         ORDER BY last_update DESC
    """, (user_id,))
    rows = cur.fetchall()
    conn.close()

    # 4. Transformă în JSON
    devices = [
        {
            "esp_id": row["esp_id"],
            "mac": row["mac"],
            "last_update": row["last_update"]
        }
        for row in rows
    ]

    # 5. Trimite lista înapoi
    return jsonify(devices=devices), 200

@app.route('/esp', methods=['GET'])
@jwt_required()
def get_user_esps():
    # 1. Identifică username-ul din JWT
    current_username = get_jwt_identity()

    # 2. Obține ID-ul numeric al user-ului
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT id FROM users WHERE username = ?", (current_username,))
    user_row = cur.fetchone()
    if not user_row:
        conn.close()
        return jsonify(error="user_not_found"), 404
    user_id = user_row["id"]

    # 3. Interoghează toate ESP-urile asociate user_id-ului
    cur.execute("""
        SELECT esp_id, mac, last_update
          FROM devices
         WHERE user_id = ?
      ORDER BY last_update DESC
    """, (user_id,))
    rows = cur.fetchall()
    conn.close()

    # 4. Construiește răspunsul
    esps = [
        {
            "esp_id": row["esp_id"],
            "mac": row["mac"],
            "last_update": row["last_update"]
        }
        for row in rows
    ]
    return jsonify(esps=esps), 200

@socketio.on('get_esps')
@jwt_required()
def handle_get_esps():
    # extragi username-ul din JWT
    current_username = get_jwt_identity()

    # găsești ID-ul numeric al user-ului
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT id FROM users WHERE username = ?", (current_username,))
    user_row = cur.fetchone()
    if not user_row:
        conn.close()
        # emiți un eveniment de eroare
        emit('esps_error', {'error': 'user_not_found'})
        return
    user_id = user_row['id']

    # interoghezi ESP-urile asociate
    cur.execute("""
        SELECT esp_id, mac, last_update
          FROM devices
         WHERE user_id = ?
      ORDER BY last_update DESC
    """, (user_id,))
    rows = cur.fetchall()
    conn.close()

    # construiești payload-ul
    esps = [
        {'esp_id': r['esp_id'], 'mac': r['mac'], 'last_update': r['last_update']}
        for r in rows
    ]

    # emiți lista către client
    emit('esps_list', {'esps': esps})


# -------- ESP & Sensors --------
@app.route("/data", methods=["OPTIONS", "POST"])
def receive_data():
    if request.method == "OPTIONS":
        return make_response("", 204)
    data = request.get_json()
    if not data:
        return jsonify(error="No JSON"), 400
    try:
        validate(instance=data, schema=data_schema)
    except ValidationError as e:
        return jsonify(error="invalid_schema", details=e.message), 400
    esp_id = data["esp_id"]
    mac = data["mac"]
    did = get_device_id(esp_id, mac)
    conn = get_db_connection()
    c = conn.cursor()
    for s in data["sensors"]:
        c.execute(
            "INSERT INTO sensor_readings (device_id, sensor_id, sensor_type, sensor_values) VALUES (?, ?, ?, ?)",
            (did, s["sensor_id"], s["type"], json.dumps(s["values"]))
        )
    conn.commit()
    conn.close()
    return jsonify(message="Data stored"), 200

@app.route("/connected_devices", methods=["OPTIONS", "POST"])
def update_connected_devices():
    if request.method == "OPTIONS":
        return make_response("", 204)
    data = request.get_json()
    if not data:
        return jsonify(error="No JSON"), 400
    try:
        validate(instance=data, schema=connected_devices_schema)
    except ValidationError as e:
        return jsonify(error="invalid_schema", details=e.message), 400
    esp_id = data["esp_id"]
    mac = data["mac"]
    get_device_id(esp_id, mac)
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("DELETE FROM connected_devices WHERE esp_id = ?", (esp_id,))
    for d in data["connected_devices"]:
        c.execute(
            "INSERT INTO connected_devices (esp_id, device_type, interact) VALUES (?, ?, ?)",
            (esp_id, d["type"], d["interact"])
        )
    conn.commit()
    conn.close()
    return jsonify(message="Connected devices updated"), 200

# -------- UI & Startup --------
def show_devices_tkinter():
    logging.info("Launching Tkinter UI")
    root = tk.Tk()
    root.title("Devices")
    tree = ttk.Treeview(root, columns=("esp_id", "mac"), show="headings")
    tree.heading("esp_id", text="ESP ID")
    tree.heading("mac", text="MAC")
    tree.pack(fill="both", expand=True, padx=10, pady=10)

    def refresh():
        conn = get_db_connection()
        c = conn.cursor()
        c.execute("SELECT esp_id, mac FROM devices")
        rows = c.fetchall()
        conn.close()
        for i in tree.get_children():
            tree.delete(i)
        for r in rows:
            tree.insert("", "end", values=(r["esp_id"], r["mac"]))

    btn = tk.Button(root, text="Refresh", command=refresh)
    btn.pack(pady=(0,10))
    refresh()
    root.mainloop()

def run_flask():
    logging.info("Starting Flask on port 5000")
    socketio.run(app, host='0.0.0.0', port=5000, debug=False, use_reloader=False)

if __name__ == "__main__":
    logging.info("Initializing app")
    create_tables()
    t = threading.Thread(target=run_flask, daemon=True)
    t.start()
    show_devices_tkinter()
