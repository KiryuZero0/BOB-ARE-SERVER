// src/pages/Auth.jsx
import React, { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    Snackbar,
    Alert,
    TextField
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';

const schema = yup.object({
    username: yup
        .string()
        .required('username_required')
        .min(3, 'username_min'),
    password: yup
        .string()
        .required('password_required')
        .min(6, 'password_min'),
    confirmPassword: yup
        .string()
        .when('mode', {
            is: 'register',
            then: yup
                .string()
                .oneOf([yup.ref('password')], 'confirm_password_match')
                .required('confirm_password_required'),
        }),
    mode: yup.string().oneOf(['login', 'register']).required()
});

export default function Auth() {
    const { t } = useTranslation();
    const [mode, setMode] = useState('login');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbar, setSnackbar] = useState({ msg: '', sev: 'success' });

    const {
        handleSubmit,
        control,
        reset,
        formState: { errors, isSubmitting }
    } = useForm({
        defaultValues: { username: '', password: '', confirmPassword: '', mode },
        resolver: yupResolver(schema)
    });

    const onSubmit = async data => {
        setOpenSnackbar(false);
        try {
            let sendData;
            if (data.confirmPassword === '') {
                sendData = {username: data.username, password: data.password}
            }
            else {
                sendData = {username: data.username, password: data.password, confirmPassword: data.confirmPassword}
            }
            const res = await fetch(`http://localhost:5000/${mode}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(sendData),
            });
            const result = await res.json();
            if (res.ok) {
                localStorage.setItem('token', result.token);
                setSnackbar({
                    msg: mode === 'register'
                        ? t('register_success')
                        : t('login_success'),
                    sev: 'success'
                });
                reset({ username: '', password: '', confirmPassword: '', mode });
            } else {
                setSnackbar({ msg: result.error || t('server_error'), sev: 'error' });
            }
        } catch (err) {
            setSnackbar({
                msg: t('network_error', { message: err.message }),
                sev: 'error'
            });
        } finally {
            setOpenSnackbar(true);
        }
    };

    return (
        <>
            <Card sx={{
                maxWidth: 400,
                mx: 'auto',
                mt: 4,
                bgcolor: '#111',
                border: '2px solid',
                borderColor: 'primary.main',
                boxShadow: '0 0 20px primary.main'
            }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom sx={{
                        color: 'primary.main',
                        textAlign: 'center',
                        animation: 'neon 1.5s ease-in-out infinite alternate'
                    }}>
                        {mode === 'register' ? t('register') : t('login')}
                    </Typography>
                    <Box
                        component="form"
                        noValidate
                        onSubmit={handleSubmit(onSubmit)}
                        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                    >
                        {/* Username */}
                        <Controller
                            name="username"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label={t('username')}
                                    variant="outlined"
                                    error={!!errors.username}
                                    helperText={t(errors.username?.message)}
                                    fullWidth
                                    InputProps={{
                                        sx: {
                                            backgroundColor: 'rgba(255,255,255,0.15)',
                                            color: 'text.primary',
                                            borderRadius: 1,
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'primary.main'
                                            },
                                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'secondary.main'
                                            },
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'primary.main',
                                                boxShadow: '0 0 5px currentColor'
                                            }
                                        }
                                    }}
                                    InputLabelProps={{
                                        sx: {
                                            color: 'text.secondary',
                                            '&.Mui-focused': { color: 'primary.main' }
                                        }
                                    }}
                                />
                            )}
                        />

                        {/* Password */}
                        <Controller
                            name="password"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    type="password"
                                    label={t('password')}
                                    variant="outlined"
                                    error={!!errors.password}
                                    helperText={t(errors.password?.message)}
                                    fullWidth
                                    InputProps={{
                                        sx: {
                                            backgroundColor: 'rgba(255,255,255,0.15)',
                                            color: 'text.primary',
                                            borderRadius: 1,
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'primary.main'
                                            },
                                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'secondary.main'
                                            },
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'primary.main',
                                                boxShadow: '0 0 5px currentColor'
                                            }
                                        }
                                    }}
                                    InputLabelProps={{
                                        sx: {
                                            color: 'text.secondary',
                                            '&.Mui-focused': { color: 'primary.main' }
                                        }
                                    }}
                                />
                            )}
                        />

                        {/* Confirm Password */}
                        {mode === 'register' && (
                            <Controller
                                name="confirmPassword"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        type="password"
                                        label={t('confirm_password')}
                                        variant="outlined"
                                        error={!!errors.confirmPassword}
                                        helperText={t(errors.confirmPassword?.message)}
                                        fullWidth
                                        InputProps={{
                                            sx: {
                                                backgroundColor: 'rgba(255,255,255,0.15)',
                                                color: 'text.primary',
                                                borderRadius: 1,
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: 'primary.main'
                                                },
                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: 'secondary.main'
                                                },
                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: 'primary.main',
                                                    boxShadow: '0 0 5px currentColor'
                                                }
                                            }
                                        }}
                                        InputLabelProps={{
                                            sx: {
                                                color: 'text.secondary',
                                                '&.Mui-focused': { color: 'primary.main' }
                                            }
                                        }}
                                    />
                                )}
                            />
                        )}

                        {/* Submit */}
                        <Button
                            type="submit"
                            variant="outlined"
                            color="secondary"
                            disabled={isSubmitting}
                        >
                            {mode === 'register' ? t('register') : t('login')}
                        </Button>
                    </Box>

                    {/* Toggle mode */}
                    <Button
                        onClick={() => {
                            setMode(prev => prev === 'register' ? 'login' : 'register');
                            reset({ username: '', password: '', confirmPassword: '', mode });
                        }}
                        sx={{ mt: 1, color: 'primary.main', display: 'block', mx: 'auto' }}
                    >
                        {mode === 'register' ? t('have_account') : t('no_account')}
                    </Button>
                </CardContent>
            </Card>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={4000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setOpenSnackbar(false)}
                    severity={snackbar.sev}
                    sx={{ width: '100%' }}
                >
                    {snackbar.msg}
                </Alert>
            </Snackbar>
        </>
    );
}
