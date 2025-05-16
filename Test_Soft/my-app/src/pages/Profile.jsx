// src/pages/Profile.jsx
import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    TextField,
    Stack
} from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function Profile() {
    const { t } = useTranslation();
    const [user, setUser] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({ username: '', email: '' });
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
                setFormData({ username: data.username, email: data.email || '' });
            })
            .catch(console.error);
    }, [token]);

    const handleChange = e => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = async () => {
        try {
            const res = await fetch('http://localhost:5000/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                const updated = await res.json();
                setUser(updated);
                setEditMode(false);
            } else {
                console.error('Update failed');
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleCancel = () => {
        setFormData({ username: user.username, email: user.email || '' });
        setEditMode(false);
    };

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

                    {editMode ? (
                        <Stack spacing={2}>
                            <TextField
                                name="username"
                                label={t('username')}
                                variant="outlined"
                                fullWidth
                                value={formData.username}
                                onChange={handleChange}
                                InputProps={{
                                    sx: { backgroundColor: 'rgba(255,255,255,0.15)', color: 'text.primary' }
                                }}
                            />
                            <TextField
                                name="email"
                                label={t('email')}
                                variant="outlined"
                                fullWidth
                                value={formData.email}
                                onChange={handleChange}
                                InputProps={{
                                    sx: { backgroundColor: 'rgba(255,255,255,0.15)', color: 'text.primary' }
                                }}
                            />
                            <Stack direction="row" spacing={1}>
                                <Button variant="contained" onClick={handleSave}>
                                    {t('save')}
                                </Button>
                                <Button variant="outlined" onClick={handleCancel}>
                                    {t('cancel')}
                                </Button>
                            </Stack>
                        </Stack>
                    ) : (
                        <>
                            <Typography sx={{ color: 'text.primary', mb: 1 }}>
                                {t('username')}: {user.username}
                            </Typography>
                            <Typography sx={{ color: 'text.primary', mb: 3 }}>
                                {t('email')}: {user.email || '–––'}
                            </Typography>
                            <Button
                                variant="outlined"
                                fullWidth
                                onClick={() => setEditMode(true)}
                            >
                                {t('edit_profile')}
                            </Button>
                        </>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
}
