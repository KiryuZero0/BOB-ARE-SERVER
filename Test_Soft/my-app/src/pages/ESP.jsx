import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, Paper } from '@mui/material';

const ESP = () => {
    const [esps, setEsps] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetch('http://localhost:5000/esps')
            .then((res) => res.json())
            .then((data) => setEsps(data))
            .catch((err) => setMessage(err.message));
    }, []);

    return (
        <Box
            sx={{
                bgcolor: '#000000',
                border: '4px solid #00ffcc',
                p: 4,
                borderRadius: 2,
                textAlign: 'center',
                boxShadow: '0 0 20px #00ffcc'
            }}
        >
            <Typography variant="h5" gutterBottom sx={{ color: '#00ffcc' }}>
                ESP-uri conectate
            </Typography>
            {message && (
                <Typography variant="body1" sx={{ color: '#ffffff' }}>
                    {message}
                </Typography>
            )}
            <List>
                {esps.map((esp) => (
                    <ListItem key={esp.id}>
                        <Paper sx={{ p: 2, width: '100%', bgcolor: '#ffffff', color: '#000000', fontFamily: '"Press Start 2P", cursive' }}>
                            {esp.device_name} - {esp.status} - {esp.data}
                        </Paper>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default ESP;
