import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Temă personalizată retro
const theme = createTheme({
    palette: {
        primary: { main: '#00ffcc' }, // neon teal
        secondary: { main: '#ff00ff' }, // magenta neon
        background: { default: '#000000' }, // fundal negru
        text: { primary: '#ffffff' },
    },
    typography: {
        fontFamily: '"Press Start 2P", cursive',
    },
});

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
        </ThemeProvider>
    </React.StrictMode>
);
