import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress
} from '@mui/material';
import {
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

export default function Dashboard() {
    const token = localStorage.getItem('token');
    if (!token) return null;

    const [history, setHistory] = useState([]);
    const [devices, setDevices] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch lista de ESP-uri
        fetch('http://localhost:5000/esps', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setDevices(data))
            .catch(console.error);

        // Fetch date istorice pentru grafice
        fetch('http://localhost:5000/esps/history', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                // Ne așteptăm la un array de obiecte cu { device_id, timestamp, temperature, humidity }
                setHistory(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [token]);

    const handleChange = (e) => {
        setSelectedDevice(e.target.value);
    };

    const filteredData = selectedDevice
        ? history.filter(item => item.device_id === selectedDevice)
        : history;

    if (loading) {
        return (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
                <CircularProgress color="primary" />
            </Box>
        );
    }

    return (
        <Box sx={{ mt: 4 }}>
            <Typography
                variant="h4"
                gutterBottom
                sx={{
                    color: 'primary.main',
                    textAlign: 'center',
                    animation: 'neon 1.5s ease-in-out infinite alternate'
                }}
            >
                Dashboard ESP-uri
            </Typography>

            <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel id="device-select-label">Device</InputLabel>
                <Select
                    labelId="device-select-label"
                    value={selectedDevice}
                    label="Device"
                    onChange={handleChange}
                >
                    <MenuItem value="">Toate</MenuItem>
                    {devices.map(d => (
                        <MenuItem key={d.id} value={d.id}>
                            {d.device_name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={filteredData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="temperature"
                        name="Temperatură (°C)"
                        stroke="#00ffcc"
                        dot={false}
                    />
                    <Line
                        type="monotone"
                        dataKey="humidity"
                        name="Umiditate (%)"
                        stroke="#ff00ff"
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </Box>
    );
}
