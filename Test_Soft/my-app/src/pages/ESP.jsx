// src/pages/ESP.jsx
import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Grid, Card, CardContent
} from '@mui/material';

export default function ESP() {
    const [devices, setDevices] = useState([]);
    const [err, setErr] = useState('');

    useEffect(()=>{
        fetch('http://localhost:5000/esps')
            .then(res=>res.json())
            .then(setDevices)
            .catch(e=>setErr(e.message));
    },[]);

    return (
        <Box sx={{
            mt:1,
            textAlign:'center'
        }}>
            <Typography variant="h4" gutterBottom sx={{
                color:'primary.main',
                animation:'neon 1.5s ease-in-out infinite alternate'
            }}>
                ESP-uri conectate
            </Typography>
            {err && (
                <Typography sx={{ color:'secondary.main' }}>{err}</Typography>
            )}
            <Grid container spacing={2} sx={{ mt:2 }}>
                {devices.map(d=>(
                    <Grid item xs={12} sm={6} key={d.id}>
                        <Card sx={{
                            bgcolor:'#111',
                            border:'1px solid',
                            borderColor:'primary.main',
                            boxShadow:'0 0 10px primary.main'
                        }}>
                            <CardContent>
                                <Typography sx={{ color:'text.primary', fontSize:'0.8rem' }}>
                                    {d.device_name}
                                </Typography>
                                <Typography sx={{ color:d.status === 'online' ? 'primary.main' : 'secondary.main' }}>
                                    {d.status.toUpperCase()}
                                </Typography>
                                <Typography variant="caption" sx={{ color:'text.secondary' }}>
                                    {d.data}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
