import { Box, Button, TextField } from '@mui/material'
import React, { useState } from 'react'
import Sidenav from '../component/Sidenav'
import Navbar from '../component/Navbar'

function ResetPassword() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const handleChange = (event) => {
        setEmail(event.target.value);
      };

      const handleSubmit = async (event) => {
        event.preventDefault();
        try {
          const response = await fetch('http://localhost:8000/api/password-reset', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
          });
          if (response.ok) {
            alert('Password reset link sent to your email account.');
            window.location.reload()
            console.log(response.ok)
          } else {
            alert('Failed to send password reset link.');
          }
        } catch (error) {
          console.error('Error:', error);
         
        }
      };
      const handlePasswordSubmit = async (event) => {
        event.preventDefault();
        try {
          const token = window.location.pathname.split('/').pop(); 
          console.log('token.',token)
          const response = await fetch(`http://localhost:8000/api/password-reset/${token}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password }),
          });
          const data = await response.json();
          if (response.ok) {
            alert('Password reset successfully.');
           
            window.location.reload();
          } else {
            alert(data || 'Failed to reset password.');
          }
        } catch (error) {
          console.error('Error:', error);
          alert('An error occurred. Please try again later.');
        }
      };
    
  return (
    <>
    <Navbar/>
    <Box height={30}/>
    <Box sx={{display:'flex'}}>
      <Sidenav/>
     
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <h1>ResetPassword</h1>
      <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              variant="outlined"
              value={email}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>

            
          </form>

          <form onSubmit={handlePasswordSubmit}>
        <TextField
          type="password"
          label="New Password"
          variant="outlined"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">
          Reset Password
        </Button>
       
      </form>
      </Box>
    </Box></>
  )
}

export default ResetPassword