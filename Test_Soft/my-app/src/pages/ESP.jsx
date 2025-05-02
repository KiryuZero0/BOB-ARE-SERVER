// src/pages/ESP.jsx
import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Skeleton,
    Snackbar,
    Alert
} from '@mui/material';
import { io } from 'socket.io-client';

export default function ESP() {
    // Dacă nu ești autentificat, nu afișăm pagina
    const token = localStorage.getItem('token');
    if (!token) return null;

    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);

    // Snackbar pentru erori
    const [openErrSnackbar, setOpenErrSnackbar] = useState(false);
    const [errMessage, setErrMessage] = useState('');

    useEffect(() => {
        // Conectare WebSocket la serverul de ESP-uri
        const socket = io('http://localhost:5000', {
            // dacă ai nevoie de autentificare WebSocket:
            // auth: { token }
        });

        socket.on('connect', () => {
            console.log('Socket conectat:', socket.id);
        });

        // Când primim lista de device-uri, o salvăm și oprim loading-ul
        socket.on('devices', (data) => {
            setDevices(data);
            setLoading(false);
        });

        // Gestionare erori de conexiune
        socket.on('connect_error', (err) => {
            setErrMessage(`Eroare Socket: ${err.message}`);
            setOpenErrSnackbar(true);
            setLoading(false);
        });

        // La demontare, deconectăm socket-ul
        return () => {
            socket.disconnect();
        };
    }, [token]);

    return (
        <>
            <Box sx={{ mt: 1, textAlign: 'center' }}>
                <Typography
                    variant="h4"
                    gutterBottom
                    sx={{
                        color: 'primary.main',
                        animation: 'neon 1.5s ease-in-out infinite alternate'
                    }}
                >
                    ESP-uri conectate
                </Typography>

                <Grid container spacing={2} sx={{ mt: 2 }}>
                    {loading
                        ? Array.from({ length: 6 }).map((_, i) => (
                            <Grid item xs={12} sm={6} key={i}>
                                <Skeleton variant="rectangular" height={100} />
                            </Grid>
                        ))
                        : devices.map((d) => (
                            <Grid item xs={12} sm={6} key={d.id}>
                                <Card
                                    sx={{
                                        bgcolor: '#111',
                                        border: '1px solid',
                                        borderColor: 'primary.main',
                                        boxShadow: '0 0 10px primary.main'
                                    }}
                                >
                                    <CardContent>
                                        <Typography
                                            sx={{ color: 'text.primary', fontSize: '0.8rem' }}
                                        >
                                            {d.device_name}
                                        </Typography>
                                        <Typography
                                            sx={{
                                                color:
                                                    d.status === 'online'
                                                        ? 'primary.main'
                                                        : 'secondary.main'
                                            }}
                                        >
                                            {d.status.toUpperCase()}
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            sx={{ color: 'text.secondary' }}
                                        >
                                            {d.data}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                </Grid>
            </Box>

            <Snackbar
                open={openErrSnackbar}
                autoHideDuration={4000}
                onClose={() => setOpenErrSnackbar(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setOpenErrSnackbar(false)}
                    severity="error"
                    sx={{ width: '100%' }}
                >
                    {errMessage}
                </Alert>
            </Snackbar>
        </>
    );
}
