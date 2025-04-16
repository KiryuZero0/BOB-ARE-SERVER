import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, List, ListItem, Paper } from '@mui/material';

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
        <Container maxWidth="md" sx={{ mt: 8 }}>
            <Box
                sx={{
                    bgcolor: '#1976d2',
                    color: '#fff',
                    p: 4,
                    borderRadius: 2,
                    textAlign: 'center',
                }}
            >
                <Typography variant="h5" gutterBottom>
                    ESP-uri conectate
                </Typography>
                {message && (
                    <Typography variant="body1">
                        {message}
                    </Typography>
                )}
                <List>
                    {esps.map((esp) => (
                        <ListItem key={esp.id}>
                            <Paper sx={{ p: 2, width: '100%' }}>
                                {esp.device_name} - {esp.status} - {esp.data}
                            </Paper>
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Container>
    );
};

export default ESP;
