import React, { useState } from 'react';
import axios from 'axios';
import { Container, CssBaseline, Typography, TextField, Button, Box, Grid } from '@mui/material';
import {useNavigate} from "react-router-dom";

const LoginForm = () => {

    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/login`, formData);
        const user = response.data.user;
        localStorage.setItem('gntcuser', JSON.stringify(user.email));
        localStorage.setItem('gntcuserrole', JSON.stringify(user.role));

        navigate('/kalendari')
        
        } catch (error) {
        console.error('Error:', error.message);
        // Handle login error
        }
    };

    return (
        <Container component="main" maxWidth="xs" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh' }}>
        <CssBaseline />
        <Box
            sx={{
            marginTop: 20,
            p: 4,
            border: '1px solid #ccc',
            borderRadius: '8px',
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
            backgroundColor: '#fff'
            }}
        >
            <Typography component="h1" variant="h5" align="center">
            Agjenda e Takimeve
            </Typography>
            <Box component="form" noValidate sx={{ mt: 1 }}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                <TextField
                    fullWidth
                    id="email"
                    label="Email Adresa"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    value={formData.email}
                    onChange={handleChange}
                />
                </Grid>
                <Grid item xs={12}>
                <TextField
                    fullWidth
                    name="password"
                    label="Fjalëkalimi"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleChange}
                />
                </Grid>
            </Grid>
            <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleSubmit}
            >
               Kyçu
            </Button>
            </Box>
        </Box>
        </Container>
    );
};

export default LoginForm;
