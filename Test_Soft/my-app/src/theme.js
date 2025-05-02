// src/theme.js
import { createTheme } from '@mui/material/styles';

export default function getTheme(mode) {
    const isDark = mode === 'dark';

    return createTheme({
        palette: {
            mode,
            primary: { main: '#00ffcc' },
            secondary: { main: '#ff00ff' },
            background: {
                default: isDark ? '#121212' : '#000000',
                paper: isDark ? '#1e1e1e' : '#111111'
            },
            text: {
                primary: isDark ? '#ffffff' : '#ffffff',
                secondary: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.7)'
            }
        },
        typography: {
            fontFamily: '"Press Start 2P", cursive'
        },
        components: {
            MuiCssBaseline: {
                styleOverrides: {
                    '@global': {
                        '@keyframes neon': {
                            '0%': { textShadow: `0 0 5px ${isDark ? '#00ffcc' : '#00ffcc'}` },
                            '100%': { textShadow: `0 0 20px ${isDark ? '#00ffcc' : '#00ffcc'}` }
                        },
                        body: { margin: 0 }
                    }
                }
            },
            MuiButton: {
                styleOverrides: {
                    root: {
                        border: '2px solid',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            boxShadow: '0 0 10px currentColor, 0 0 20px currentColor'
                        }
                    }
                }
            }
        }
    });
}
