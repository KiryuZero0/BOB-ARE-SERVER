// src/main.jsx
import React, { useMemo, useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, CssBaseline } from '@mui/material';
import getTheme from './theme';
import App from './App';
import './i18n';

function Root() {
    const [mode, setMode] = useState('dark');

    // Preluăm preferința temei din localStorage sau din setarea de sistem
    useEffect(() => {
        const saved = localStorage.getItem('themeMode');
        if (saved === 'light' || saved === 'dark') {
            setMode(saved);
        } else {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setMode(prefersDark ? 'dark' : 'light');
        }
    }, []);

    // Salvăm preferința ori de câte ori se schimbă
    useEffect(() => {
        localStorage.setItem('themeMode', mode);
    }, [mode]);

    const theme = useMemo(() => getTheme(mode), [mode]);

    // Înregistrare Service Worker pentru PWA și offline support
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/serviceWorker.js')
                    .then(reg => console.log('SW registered:', reg.scope))
                    .catch(err => console.error('SW registration failed:', err));
            });
        }
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <App mode={mode} setMode={setMode} />
        </ThemeProvider>
    );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Root />);
