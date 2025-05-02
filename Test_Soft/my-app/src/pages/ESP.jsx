// src/pages/ESP.jsx
import React, { useEffect, useState, useCallback } from 'react';
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
import { useTranslation } from 'react-i18next';

function ESPComponent() {
    const { t } = useTranslation();
    const token = localStorage.getItem('token');
    if (!token) return null;

    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openErrSnackbar, setOpenErrSnackbar] = useState(false);
    const [errMessage, setErrMessage] = useState('');

    const handleCloseErrSnackbar = useCallback(() => {
        setOpenErrSnackbar(false);
    }, []);

    useEffect(() => {
        const socket = io('http://localhost:5000');
        socket.on('devices', data => {
            setDevices(data);
            setLoading(false);
        });
        socket.on('connect_error', err => {
            setErrMessage(`${t('error_loading')}: ${err.message}`);
            setOpenErrSnackbar(true);
            setLoading(false);
        });
        return () => {
            socket.disconnect();
        };
    }, [t]);

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
                    {t('esp_connected')}
                </Typography>

                <Grid container spacing={2} sx={{ mt: 2 }}>
                    {loading
                        ? Array.from({ length: 6 }).map((_, i) => (
                            <Grid item xs={12} sm={6} key={i}>
                                <Skeleton variant="rectangular" height={100} />
                            </Grid>
                        ))
                        : devices.map(d => (
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
                                        <Typography sx={{ color: 'text.primary', fontSize: '0.8rem' }}>
                                            {d.device_name}
                                        </Typography>
                                        <Typography
                                            sx={{
                                                color: d.status === 'online' ? 'primary.main' : 'secondary.main'
                                            }}
                                        >
                                            {t(d.status)}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
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
                onClose={handleCloseErrSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseErrSnackbar} severity="error" sx={{ width: '100%' }}>
                    {errMessage}
                </Alert>
            </Snackbar>
        </>
    );
}

export default React.memo(ESPComponent);
