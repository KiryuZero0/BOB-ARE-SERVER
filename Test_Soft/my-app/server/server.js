import express from 'express';
import sqlite3Module from 'sqlite3';
import cors from 'cors';

const sqlite3 = sqlite3Module.verbose();
const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());

// Deschide sau creează baza de date
const db = new sqlite3.Database('./server/database.sqlite', (err) => {
    if (err) {
        console.error('Eroare la deschiderea bazei de date:', err.message);
    } else {
        console.log('Conexiunea la baza de date a fost realizată.');

        // Crează tabela utilizatori
        db.run(`
            CREATE TABLE IF NOT EXISTS users (
                                                 id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                 username TEXT UNIQUE,
                                                 password TEXT
            )
        `);

        // Crează tabela pentru ESP-uri
        db.run(`
            CREATE TABLE IF NOT EXISTS esps (
                                                id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                device_name TEXT,
                                                status TEXT,
                                                data TEXT
            )
        `);
    }
});

// Endpoint pentru înregistrare
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    const query = `INSERT INTO users (username, password) VALUES (?, ?)`;
    db.run(query, [username, password], function(err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ id: this.lastID, username });
    });
});

// Endpoint pentru login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const query = `SELECT * FROM users WHERE username = ? AND password = ?`;
    db.get(query, [username, password], (err, row) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        if (row) {
            res.json({ success: true, user: row });
        } else {
            res.status(401).json({ error: "Credențiale invalide" });
        }
    });
});

// Endpoint pentru obținerea ESP-urilor
app.get('/esps', (req, res) => {
    const query = `SELECT * FROM esps`;
    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Optional: Endpoint pentru adăugare ESP
app.post('/esps', (req, res) => {
    const { device_name, status, data } = req.body;
    const query = `INSERT INTO esps (device_name, status, data) VALUES (?, ?, ?)`;
    db.run(query, [device_name, status, data], function(err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ id: this.lastID, device_name, status, data });
    });
});

app.listen(PORT, () => {
    console.log(`Serverul rulează pe portul ${PORT}`);
});
