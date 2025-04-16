import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Button, Container } from '@mui/material';
import Home from './pages/Home';
import Auth from './pages/Auth';
import ESP from './pages/ESP';

function App() {
    return (
        <Router>
            <AppBar position="static" sx={{ bgcolor: 'transparent', boxShadow: 'none', borderBottom: '2px solid #00ffcc' }}>
                <Toolbar sx={{ justifyContent: 'center' }}>
                    <Button color="inherit" component={Link} to="/" sx={{ fontFamily: '"Press Start 2P", cursive' }}>
                        Home
                    </Button>
                    <Button color="inherit" component={Link} to="/auth" sx={{ fontFamily: '"Press Start 2P", cursive' }}>
                        Autentificare
                    </Button>
                    <Button color="inherit" component={Link} to="/esp" sx={{ fontFamily: '"Press Start 2P", cursive' }}>
                        ESP-uri
                    </Button>
                </Toolbar>
            </AppBar>
            <Container sx={{ mt: 4 }}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/esp" element={<ESP />} />
                </Routes>
            </Container>
        </Router>
    );
}

export default App;
