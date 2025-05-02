// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: { main: '#00ffcc' },   // neon teal
        secondary: { main: '#ff00ff' }, // magenta neon
        background: { default: '#000000' },
        text: { primary: '#ffffff' },
    },
    typography: {
        fontFamily: '"Press Start 2P", cursive',
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                '@global': {
                    '@keyframes neon': {
                        '0%': { textShadow: '0 0 5px #00ffcc, 0 0 10px #00ffcc' },
                        '100%': { textShadow: '0 0 20px #00ffcc, 0 0 30px #00ffcc' },
                    },
                    body: {
                        backgroundColor: '#000',
                        margin: 0,
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    border: '2px solid',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        boxShadow: '0 0 10px currentColor, 0 0 20px currentColor',
                    },
                },
            },
        },
    },
});

export default theme;
