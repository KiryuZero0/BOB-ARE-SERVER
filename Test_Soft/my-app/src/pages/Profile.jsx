// src/pages/Profile.jsx
import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Button } from '@mui/material';

export default function Profile() {
    const [user, setUser] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        // preluăm date de profil; ajustează endpoint-ul după backend
        fetch('http://localhost:5000/profile', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(setUser)
            .catch(console.error);
    }, [token]);

    if (!user) {
        return (
            <Typography sx={{ color: 'text.secondary', textAlign: 'center', mt: 4 }}>
                Se încarcă datele...
            </Typography>
        );
    }

    return (
        <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
            <Card sx={{ bgcolor: '#111', border: '2px solid', borderColor: 'primary.main', boxShadow: '0 0 20px primary.main' }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom sx={{
                        color: 'primary.main',
                        textAlign: 'center',
                        animation: 'neon 1.5s ease-in-out infinite alternate'
                    }}>
                        Profilul meu
                    </Typography>
                    <Typography sx={{ color: 'text.primary', mb: 1 }}>
                        Username: {user.username}
                    </Typography>
                    <Typography sx={{ color: 'text.primary', mb: 3 }}>
                        Email: {user.email || '–––'}
                    </Typography>
                    <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => {
                            // permite actualizarea datelor în viitor
                            alert('Funcționalitate de editare neimplementată încă.');
                        }}
                    >
                        Editează profil
                    </Button>
                </CardContent>
            </Card>
        </Box>
    );
}
