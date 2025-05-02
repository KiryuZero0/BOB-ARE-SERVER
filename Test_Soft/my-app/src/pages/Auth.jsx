// src/pages/Auth.jsx
import React, { useState } from 'react';
import {
    Box, Typography, TextField, Button, Card, CardContent
} from '@mui/material';

export default function Auth() {
    const [u, setU] = useState('');
    const [p, setP] = useState('');
    const [reg, setReg] = useState(true);
    const [msg, setMsg] = useState('');

    const handle = async e => {
        e.preventDefault();
        const ep = reg ? 'register' : 'login';
        try {
            const res = await fetch(`http://localhost:5000/${ep}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: u, password: p })
            });
            const data = await res.json();
            if (res.ok) {
                // Stocăm token-ul pentru a verifica autentificarea
                localStorage.setItem('token', data.token);
                setMsg(`Succes: ${JSON.stringify(data)}`);
            } else {
                setMsg(`Eroare: ${data.error}`);
            }
        } catch (e) {
            setMsg(`Eroare rețea: ${e.message}`);
        }
    };

    return (
        <Card sx={{
            maxWidth: 400,
            mx: 'auto',
            bgcolor: '#111',
            border: '2px solid',
            borderColor: 'primary.main',
            boxShadow: '0 0 20px primary.main'
        }}>
            <CardContent>
                <Typography variant="h5" gutterBottom sx={{
                    color: 'primary.main',
                    textAlign: 'center',
                    animation: 'neon 1.5s ease-in-out infinite alternate'
                }}>
                    {reg ? 'Înregistrare' : 'Autentificare'}
                </Typography>
                <Box component="form" onSubmit={handle} sx={{
                    display: 'flex', flexDirection: 'column', gap: 2
                }}>
                    {[{
                        label: 'Username', value: u, set: setU
                    }, {
                        label: 'Password', value: p, set: setP, type: 'password'
                    }].map((f, i) => (
                        <TextField
                            key={i}
                            label={f.label}
                            type={f.type || 'text'}
                            variant="filled"
                            value={f.value}
                            onChange={e => f.set(e.target.value)}
                            fullWidth
                            InputProps={{
                                sx: {
                                    bgcolor: '#fff',
                                    color: '#000',
                                    fontFamily: '"Press Start 2P",cursive'
                                }
                            }}
                        />
                    ))}
                    <Button type="submit" variant="outlined" color="secondary" fullWidth>
                        {reg ? 'Înregistrează-te' : 'Login'}
                    </Button>
                </Box>
                <Button
                    onClick={() => setReg(!reg)}
                    sx={{ mt: 2, color: 'primary.main', display: 'block', mx: 'auto' }}
                >
                    {reg ? 'Ai deja cont? Autentifică-te' : 'Nu ai cont? Înregistrează-te'}
                </Button>
                {msg && (
                    <Typography variant="body2" sx={{
                        mt: 2, color: 'primary.main', wordBreak: 'break-all', textAlign: 'center'
                    }}>
                        {msg}
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
}
