// src/pages/Home.jsx
import React, { useCallback } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

function HomeComponent() {
    const { t } = useTranslation();
    const token = localStorage.getItem('token');

    const goToAuth = useCallback(() => {
        window.location.href = '/auth';
    }, []);

    return (
        <Box
            sx={{
                bgcolor: '#111',
                border: '2px solid',
                borderColor: 'primary.main',
                p: 5,
                borderRadius: 3,
                textAlign: 'center',
                boxShadow: '0 0 20px primary.main'
            }}
        >
            <Typography
                variant="h3"
                gutterBottom
                sx={{
                    color: 'primary.main',
                    animation: 'neon 1.5s ease-in-out infinite alternate'
                }}
            >
                {t('welcome_message')}
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.primary', mb: 3 }}>
                {t('home_description')}
            </Typography>
            {!token && (
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={goToAuth}
                    sx={{ fontSize: '0.9rem' }}
                >
                    {t('login')}
                </Button>
            )}
        </Box>
    );
}

export default React.memo(HomeComponent);
