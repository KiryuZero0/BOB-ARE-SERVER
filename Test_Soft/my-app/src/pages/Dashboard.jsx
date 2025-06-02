// src/pages/Dashboard.jsx
import React, { useEffect, useState, useCallback, useMemo } from 'react';
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
import { useTranslation } from 'react-i18next';

function DashboardComponent() {
    const { t } = useTranslation();
    const token = localStorage.getItem('token');
    if (!token) return null;

    const [history, setHistory] = useState([]);
    const [devices, setDevices] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/esp', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(setDevices)
            .catch(console.error);

        fetch('/api/dashboard', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                setHistory(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [token]);

    const handleChange = useCallback(e => {
        setSelectedDevice(e.target.value);
    }, []);

    const filteredData = useMemo(() => {
        return selectedDevice
            ? history.filter(item => item.device_id === selectedDevice)
            : history;
    }, [history, selectedDevice]);

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
                {t('dashboard')}
            </Typography>

            <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel id="device-select-label">{t('select_device')}</InputLabel>
                <Select
                    labelId="device-select-label"
                    value={selectedDevice}
                    label={t('select_device')}
                    onChange={handleChange}
                >
                    <MenuItem value="">{t('all')}</MenuItem>
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
                        name={t('temperature')}
                        stroke="#00ffcc"
                        dot={false}
                    />
                    <Line
                        type="monotone"
                        dataKey="humidity"
                        name={t('humidity')}
                        stroke="#ff00ff"
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </Box>
    );
}

export default React.memo(DashboardComponent);
