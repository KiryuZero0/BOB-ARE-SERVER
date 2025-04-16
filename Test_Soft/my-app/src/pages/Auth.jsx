import React, { useState } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';

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
        <Box
            sx={{
                maxWidth: 400,
                mx: 'auto',
                bgcolor: '#000000',
                p: 4,
                border: '4px solid #00ffcc',
                borderRadius: 2,
                textAlign: 'center',
                boxShadow: '0 0 20px #00ffcc'
            }}
        >
            <Typography variant="h5" gutterBottom sx={{ color: '#00ffcc' }}>
                {isRegister ? 'Înregistrare' : 'Autentificare'}
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                    label="Username"
                    variant="filled"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    fullWidth
                    InputProps={{
                        style: { backgroundColor: '#ffffff', color: '#000000', fontFamily: '"Press Start 2P", cursive' }
                    }}
                />
                <TextField
                    label="Password"
                    variant="filled"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    InputProps={{
                        style: { backgroundColor: '#ffffff', color: '#000000', fontFamily: '"Press Start 2P", cursive' }
                    }}
                />
                <Button type="submit" variant="contained" color="secondary" fullWidth sx={{ fontFamily: '"Press Start 2P", cursive' }}>
                    {isRegister ? 'Înregistrează-te' : 'Login'}
                </Button>
            </Box>
            <Button
                variant="text"
                onClick={() => setIsRegister(!isRegister)}
                sx={{ mt: 2, color: '#00ffcc', fontFamily: '"Press Start 2P", cursive' }}
            >
                {isRegister ? 'Ai deja cont? Autentifică-te' : 'Nu ai cont? Înregistrează-te'}
            </Button>
            {message && (
                <Typography variant="body2" sx={{ mt: 2, color: '#00ffcc', wordBreak: 'break-all' }}>
                    {message}
                </Typography>
            )}
        </Box>
    );
};

export default Auth;
