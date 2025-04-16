import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button } from '@mui/material';

const Auth = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isRegister, setIsRegister] = useState(true);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = isRegister ? 'register' : 'login';

        try {
            const res = await fetch(`http://localhost:5000/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            const data = await res.json();
            if (res.ok) {
                setMessage(`Succes: ${JSON.stringify(data)}`);
            } else {
                setMessage(`Eroare: ${data.error}`);
            }
        } catch (err) {
            setMessage(`Eroare de rețea: ${err.message}`);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
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
                    {isRegister ? 'Înregistrare' : 'Autentificare'}
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        variant="filled"
                        label="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        InputProps={{ sx: { bgcolor: '#fff', color: '#000' } }}
                    />
                    <TextField
                        variant="filled"
                        type="password"
                        label="Parolă"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        InputProps={{ sx: { bgcolor: '#fff', color: '#000' } }}
                    />
                    <Button type="submit" variant="contained" color="secondary">
                        {isRegister ? 'Înregistrează-te' : 'Login'}
                    </Button>
                </Box>
                <Button variant="text" onClick={() => setIsRegister(!isRegister)} sx={{ mt: 2, color: '#fff' }}>
                    {isRegister ? 'Ai deja cont? Autentifică-te' : 'Nu ai cont? Înregistrează-te'}
                </Button>
                {message && (
                    <Typography variant="body2" sx={{ mt: 2 }}>
                        {message}
                    </Typography>
                )}
            </Box>
        </Container>
    );
};

export default Auth;
