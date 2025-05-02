// src/App.jsx
import React, { lazy, Suspense, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Button,
    Container,
    Box,
    IconButton,
    Tooltip,
    CircularProgress
} from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useTranslation } from 'react-i18next';
import PrivateRoute from './components/PrivateRoute';

// Lazy-loaded pages
const Home = lazy(() => import('./pages/Home'));
const Auth = lazy(() => import('./pages/Auth'));
const ESP = lazy(() => import('./pages/ESP'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));

const Navbar = React.memo(function Navbar({ mode, setMode }) {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const token = localStorage.getItem('token');

    const handleLogout = useCallback(() => {
        localStorage.removeItem('token');
        navigate('/auth', { replace: true });
    }, [navigate]);

    const toggleTheme = useCallback(() => {
        setMode(prev => (prev === 'light' ? 'dark' : 'light'));
    }, [setMode]);

    const switchLang = useCallback(() => {
        const next = i18n.language === 'ro' ? 'en' : 'ro';
        i18n.changeLanguage(next);
        localStorage.setItem('lang', next);
    }, [i18n]);

    const menu = [
        { to: '/', label: t('home') },
        !token && { to: '/auth', label: t('login') },
        token && { to: '/esp', label: t('esp') },
        token && { to: '/dashboard', label: t('dashboard') },
        token && { to: '/profile', label: t('profile') }
    ].filter(Boolean);

    return (
        <AppBar
            position="static"
            sx={{
                bgcolor: 'transparent',
                boxShadow: 'none',
                borderBottom: '2px solid',
                borderColor: 'primary.main'
            }}
        >
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
});

const AppComponent = React.memo(function AppComponent({ mode, setMode }) {
    return (
        <Router>
            <Navbar mode={mode} setMode={setMode} />
            <Box component="main" sx={{ mt: 4 }}>
                <Container maxWidth="md">
                    <Suspense
                        fallback={
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                                <CircularProgress color="primary" />
                            </Box>
                        }
                    >
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
                    </Suspense>
                </Container>
            </Box>
        </Router>
    );
});

export default AppComponent;
