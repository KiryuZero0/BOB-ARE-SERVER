import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Button } from '@mui/material';
import Home from './pages/Home';
import Auth from './pages/Auth';
import ESP from './pages/ESP';

function App() {
    return (
        <Router>
            <AppBar position="static">
                <Toolbar>
                    <Button color="inherit" component={Link} to="/">
                        Home
                    </Button>
                    <Button color="inherit" component={Link} to="/auth">
                        Autentificare
                    </Button>
                    <Button color="inherit" component={Link} to="/esp">
                        ESP-uri
                    </Button>
                </Toolbar>
            </AppBar>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/esp" element={<ESP />} />
            </Routes>
        </Router>
    );
}

export default App;
