// src/pages/Home.jsx
import React from 'react';
import { Box, Typography, Button } from '@mui/material';

export default function Home() {
    return (
        <Box sx={{
            bgcolor: '#111',
            border: '2px solid',
            borderColor: 'primary.main',
            p: 5,
            borderRadius: 3,
            textAlign: 'center',
            boxShadow: '0 0 20px primary.main'
        }}>
            <Typography
                variant="h3"
                gutterBottom
                sx={{
                    color: 'primary.main',
                    animation: 'neon 1.5s ease-in-out infinite alternate'
                }}
            >
                Welcome to Retro Game App
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.primary', mb: 3 }}>
                Aceasta este pagina principală a aplicației, stilată ca un joc retro.
            </Typography>
            <Button
                variant="outlined"
                color="primary"
                onClick={() => window.location.href = '/auth'}
                sx={{ fontSize: '0.9rem' }}
            >
                Autentificare / Înregistrare
            </Button>
        </Box>
    );
}
