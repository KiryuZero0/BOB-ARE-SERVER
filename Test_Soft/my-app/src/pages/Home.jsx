// src/pages/Home.jsx
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

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
            <Typography variant="h4" gutterBottom sx={{ color: '#00ffcc' }}>
                Welcome to Retro Game App
            </Typography>
            <Typography variant="body1" sx={{ color: '#ffffff', mb: 2 }}>
                Aceasta este pagina principală a aplicației, stilată ca un joc retro.
            </Typography>
            <Button
                variant="contained"
                color="secondary"
                onClick={() => navigate('/auth')}
                sx={{ fontFamily: '"Press Start 2P", cursive' }}
            >
                Autentificare/Inregistrare
            </Button>
        </Box>
    );
};

export default Home;
