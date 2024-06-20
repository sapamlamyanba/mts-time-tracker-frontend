import { Avatar, Box, Button, Container, CssBaseline, Link, TextField, ThemeProvider, Typography, createTheme } from '@mui/material'
import React from 'react'
import {  useNavigate } from 'react-router-dom';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { BASE_URL } from '../config/ipconfig';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright ©MTS '}
      <Link color="inherit" href="https://mui.com/">
        Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const defaultTheme = createTheme();

function ForgotPassword() {
  const [password, setPassword] = React.useState('');
  const navigate = useNavigate();
 

  const ResetToken = localStorage.getItem('ResetToken');
 
  const handleSubmit = async (event) => {
    event.preventDefault();

    
    try {
      const myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      const raw = JSON.stringify({
        "password": password
      });

      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
      };
      fetch(`${BASE_URL}/password-reset/${ResetToken}`, requestOptions)
        .then(response => response.text())
        .then(result => {
         
          if (result) {   
            alert('Successfully change password')            
            navigate('/')
            localStorage.clear(); 
            
          } else {
            alert('Error in Password reset')
          }
        }).catch(error => console.log('error', error));
    } catch (error) {
      console.error('Error during Setting:', error);
    }
  };
  const handleChange = (event) => {
    setPassword(event.target.value);
   
  };
  return (
    <ThemeProvider theme={defaultTheme}>
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Reset Password
        </Typography>
        <Box  noValidate sx={{ mt: 1 }}>
        <form onSubmit={handleSubmit}>
            <TextField
              label="Password"
              variant="outlined"
              value={password}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>

            
          </form>
        
        </Box>
      </Box>
      <Copyright sx={{ mt: 8, mb: 4 }} />
    </Container>
  </ThemeProvider>
  )
}

export default ForgotPassword