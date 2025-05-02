import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Button,
    Container,
    Box,
    IconButton,
    Tooltip
} from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useTranslation } from 'react-i18next';

import Home from './pages/Home';
import Auth from './pages/Auth';
import ESP from './pages/ESP';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import PrivateRoute from './components/PrivateRoute';

function Navbar({ mode, setMode }) {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/auth', { replace: true });
    };

    const toggleTheme = () => {
        setMode(prev => (prev === 'light' ? 'dark' : 'light'));
    };

    const switchLang = () => {
        const next = i18n.language === 'ro' ? 'en' : 'ro';
        i18n.changeLanguage(next);
        localStorage.setItem('lang', next);
    };

    const menu = [
        { to: '/', label: t('home') },
        !token && { to: '/auth', label: t('login') },
        token && { to: '/esp', label: t('esp') },
        token && { to: '/dashboard', label: t('dashboard') },
        token && { to: '/profile', label: t('profile') }
    ].filter(Boolean);

    return (
        <AppBar position="static" sx={{
            bgcolor: 'transparent',
            boxShadow: 'none',
            borderBottom: '2px solid',
            borderColor: 'primary.main'
        }}>
            <Toolbar sx={{ justifyContent: 'center', gap: 2, position: 'relative' }}>
                {menu.map(({ to, label }) => (
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
                        {label}
                    </Button>
                ))}

                <Box sx={{ position: 'absolute', right: 16, display: 'flex', gap: 1 }}>
                    <Tooltip title={t('toggle_theme')}>
                        <IconButton onClick={toggleTheme} sx={{ color: 'text.primary' }}>
                            {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
                        </IconButton>
                    </Tooltip>
                    <Button onClick={switchLang} sx={{ color: 'text.primary' }}>
                        {i18n.language === 'ro' ? 'EN' : 'RO'}
                    </Button>
                </Box>

                {token && (
                    <Button
                        onClick={handleLogout}
                        sx={{
                            color: 'secondary.main',
                            textShadow: '0 0 5px',
                            animation: 'neon 1.5s ease-in-out infinite alternate'
                        }}
                    >
                        {t('logout')}
                    </Button>
                )}
            </Toolbar>
        </AppBar>
    );
}

export default function App({ mode, setMode }) {
    return (
        <Router>
            <Navbar mode={mode} setMode={setMode} />
            <Box component="main" sx={{ mt: 4 }}>
                <Container maxWidth="md">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/auth" element={<Auth />} />
                        <Route
                            path="/esp"
                            element={
                                <PrivateRoute>
                                    <ESP />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/dashboard"
                            element={
                                <PrivateRoute>
                                    <Dashboard />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/profile"
                            element={
                                <PrivateRoute>
                                    <Profile />
                                </PrivateRoute>
                            }
                        />
                    </Routes>
                </Container>
            </Box>
        </Router>
    );
}
