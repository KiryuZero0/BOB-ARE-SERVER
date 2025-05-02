// src/main.jsx
import React, { useMemo, useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, CssBaseline } from '@mui/material';
import getTheme from './theme';
import App from './App';
import './i18n';
function Root() {
    const [mode, setMode] = useState('dark');

    // Preia preferința salvată sau folosește preferința sistemului
    useEffect(() => {
        const saved = localStorage.getItem('themeMode');
        if (saved === 'light' || saved === 'dark') {
            setMode(saved);
        } else {
            const prefers = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            setMode(prefers);
        }
    }, []);

    // Salvează când se schimbă
    useEffect(() => {
        localStorage.setItem('themeMode', mode);
    }, [mode]);

    const theme = useMemo(() => getTheme(mode), [mode]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <App mode={mode} setMode={setMode} />
        </ThemeProvider>
    );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Root />);
