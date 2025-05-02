const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });

let devices = [
    // exemplu static; în practică citești din BD
    { id: 1, device_name: 'ESP-1', status: 'online', data: '23°C' },
    { id: 2, device_name: 'ESP-2', status: 'offline', data: '—' },
];

// Endpoint REST pentru inițializare
app.get('/esps', (req, res) => {
    res.json(devices);
});

// La conectare client
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Trimite starea curentă
    socket.emit('devices', devices);

    // Exemplu actualizare periodică (simulare)
    const interval = setInterval(() => {
        // schimbă status aleator
        devices = devices.map(d => ({
            ...d,
            status: Math.random() > 0.5 ? 'online' : 'offline'
        }));
        io.emit('devices', devices);
    }, 5000);

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
        clearInterval(interval);
    });
});

server.listen(5000, () => {
    console.log('Server ascultă pe portul 5000');
});
