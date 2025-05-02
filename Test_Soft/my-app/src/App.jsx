// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppBar, Toolbar, Button, Container, Box } from '@mui/material';
import Home from './pages/Home';
import Auth from './pages/Auth';
import ESP from './pages/ESP';

export default function App() {
    return (
        <Router>
            <AppBar position="static" sx={{
                bgcolor: 'transparent',
                boxShadow: 'none',
                borderBottom: '2px solid',
                borderColor: 'primary.main'
            }}>
                <Toolbar sx={{ justifyContent: 'center', gap: 2 }}>
                    {['/', '/auth', '/esp'].map((to, i) => (
                        <Button
                            key={to}
                            component="a"
                            href={to}
                            sx={{
                                color: 'text.primary',
                                textShadow: '0 0 5px',
                                animation: 'neon 1.5s ease-in-out infinite alternate'
                            }}
                        >
                            {['Home','Autentificare','ESP-uri'][i]}
                        </Button>
                    ))}
                </Toolbar>
            </AppBar>
            <Box component="main" sx={{ mt: 4 }}>
                <Container maxWidth="md">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/auth" element={<Auth />} />
                        <Route path="/esp" element={<ESP />} />
                    </Routes>
                </Container>
            </Box>
        </Router>
    );
}
