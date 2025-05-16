// src/pages/Profile.jsx
import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function Profile() {
    const { t } = useTranslation();
    const [user, setUser] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({ username: '', new_username: '' });
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetch('http://localhost:5000/profile', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                setUser(data);
                setFormData({ username: data.username, new_username: data.new_username || '' });
            })
            .catch(console.error);
    }, [token]);
    if (!user) {
        return (
            <Typography sx={{ color: 'text.secondary', textAlign: 'center', mt: 4 }}>
                {t('loading')}
            </Typography>
        );
    }

    return (
        <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
            <Card sx={{
                bgcolor: '#111',
                border: '2px solid',
                borderColor: 'primary.main',
                boxShadow: '0 0 20px primary.main'
            }}>
                <CardContent>
                    <Typography
                        variant="h5"
                        gutterBottom
                        sx={{
                            color: 'primary.main',
                            textAlign: 'center',
                            animation: 'neon 1.5s ease-in-out infinite alternate'
                        }}
                    >
                        {t('my_profile')}
                    </Typography>
                        <Typography sx={{ color: 'text.primary', mb: 1 }}>
                            {t('username')}: {user.username}
                        </Typography>
                </CardContent>
            </Card>
        </Box>
    );
}
