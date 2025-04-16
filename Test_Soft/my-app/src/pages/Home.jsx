import React from 'react';
import { Container, Box, Typography } from '@mui/material';

const Home = () => {
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
                <Typography variant="h4" gutterBottom>
                    Welcome to Retro App
                </Typography>
                <Typography variant="body1">
                    Acesta este Home-ul aplicației.
                </Typography>
            </Box>
        </Container>
    );
};

export default Home;
