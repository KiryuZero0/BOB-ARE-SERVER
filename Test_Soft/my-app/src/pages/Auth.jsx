import React, { useState } from 'react';
import {
    Box, Typography, Button, Card, CardContent,
    Snackbar, Alert, TextField
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object({
    username: yup
        .string()
        .required('Username este obligatoriu')
        .min(3, 'Minim 3 caractere'),
    password: yup
        .string()
        .required('Parola este obligatorie')
        .min(6, 'Minim 6 caractere'),
    confirmPassword: yup
        .string()
        .when('mode', { // confirm doar la înregistrare
            is: 'register',
            then: yup
                .string()
                .oneOf([yup.ref('password')], 'Parolele nu coincid')
                .required('Confirmarea parolei este obligatorie'),
        }),
    mode: yup.string().oneOf(['login','register']).required(),
});

export default function Auth() {
    const [mode, setMode] = useState('register');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbar, setSnackbar] = useState({ msg: '', sev: 'success' });

    const {
        handleSubmit,
        control,
        reset,
        formState: { errors, isSubmitting }
    } = useForm({
        defaultValues: { username: '', password: '', confirmPassword: '', mode },
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data) => {
        setOpenSnackbar(false);
        try {
            const res = await fetch(`http://localhost:5000/${data.mode}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: data.username,
                    password: data.password
                })
            });
            const result = await res.json();
            if (res.ok) {
                localStorage.setItem('token', result.token);
                setSnackbar({
                    msg: data.mode === 'register' ? 'Înregistrare reușită!' : 'Login reușit!',
                    sev: 'success'
                });
                reset({ ...data, username: '', password: '', confirmPassword: '' });
            } else {
                setSnackbar({ msg: result.error || 'Eroare server', sev: 'error' });
            }
        } catch (err) {
            setSnackbar({ msg: `Eroare rețea: ${err.message}`, sev: 'error' });
        } finally {
            setOpenSnackbar(true);
        }
    };

    return (
        <>
            <Card sx={{
                maxWidth: 400, mx: 'auto', mt: 4,
                bgcolor: '#111', border: '2px solid', borderColor: 'primary.main',
                boxShadow: '0 0 20px primary.main'
            }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom sx={{
                        color: 'primary.main', textAlign: 'center',
                        animation: 'neon 1.5s ease-in-out infinite alternate'
                    }}>
                        {mode === 'register' ? 'Înregistrare' : 'Autentificare'}
                    </Typography>
                    <Box
                        component="form"
                        noValidate
                        onSubmit={handleSubmit(onSubmit)}
                        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                    >
                        <Controller
                            name="username"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Username"
                                    variant="filled"
                                    error={!!errors.username}
                                    helperText={errors.username?.message}
                                    fullWidth
                                    InputProps={{
                                        sx: { bgcolor: '#fff', color: '#000', fontFamily:'"Press Start 2P",cursive' }
                                    }}
                                />
                            )}
                        />
                        <Controller
                            name="password"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    type="password"
                                    label="Password"
                                    variant="filled"
                                    error={!!errors.password}
                                    helperText={errors.password?.message}
                                    fullWidth
                                    InputProps={{
                                        sx: { bgcolor: '#fff', color: '#000', fontFamily:'"Press Start 2P",cursive' }
                                    }}
                                />
                            )}
                        />
                        {mode === 'register' && (
                            <Controller
                                name="confirmPassword"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        type="password"
                                        label="Confirm Password"
                                        variant="filled"
                                        error={!!errors.confirmPassword}
                                        helperText={errors.confirmPassword?.message}
                                        fullWidth
                                        InputProps={{
                                            sx: { bgcolor: '#fff', color: '#000', fontFamily:'"Press Start 2P",cursive' }
                                        }}
                                    />
                                )}
                            />
                        )}
                        <Button
                            type="submit"
                            variant="outlined"
                            color="secondary"
                            disabled={isSubmitting}
                        >
                            {mode === 'register' ? 'Înregistrează-te' : 'Login'}
                        </Button>
                    </Box>
                    <Button
                        onClick={() => {
                            setMode(prev => prev === 'register' ? 'login' : 'register');
                            reset({ username: '', password: '', confirmPassword: '' });
                        }}
                        sx={{ mt: 1, color: 'primary.main', display: 'block', mx: 'auto' }}
                    >
                        {mode === 'register'
                            ? 'Ai deja cont? Autentifică-te'
                            : 'Nu ai cont? Înregistrează-te'}
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
