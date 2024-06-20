import { Avatar, Box, Button, Card, CardContent, CardHeader, Modal, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import Sidenav from '../component/Sidenav'
import Navbar from '../component/Navbar'
import { useSelector } from 'react-redux'
import { red } from '@mui/material/colors'
import { useNavigate } from 'react-router-dom'


function Profile() {
  const { user } = useSelector(state => state.user)

  const userEmail = user?.email;
  const text = user?.username ? user.username.substring(0, 1) : '';
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [checkPassword, setCheckPassword] = useState();
  const [newPassword, setNewPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const token = localStorage.getItem('token');

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (newPassword !== confirmPassword) {
        alert('New password and confirm password must match.');
        return;
      }

      const response = await fetch('http://localhost:9000/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          'email': userEmail,
          'checkPassword': checkPassword,
          'newPassword': newPassword
        }),
      });
      if (response.ok) {
        alert('Password reset Successfully.');
        window.location.reload()
       
      } else {
        alert('Failed to password reset .');
      }
    } catch (error) {
      console.error('Error:', error);

    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'Password') {
      setCheckPassword(value);
    } else if (name === 'New-Password') {
      setNewPassword(value);
    } else if (name === 'Confirm-Password') {
      setConfirmPassword(value);
    }
  };

  return (
    <Box style={{ backgroundColor: '#EDF3F3', minHeight: '20vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <Box height={30} />
      <Box sx={{ display: 'flex', backgroundColor: '#EDF3F3', paddingBottom: '250px' }}>
        <Sidenav />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <h1>Profile</h1>
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
          }}>
            <Card sx={{ width: 645, }}>
              <CardHeader sx={{
                textAlign: 'center',
                // backgroundColor: 'primary.main', 
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
                avatar={
                  <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                    {text}
                  </Avatar>
                }
              />
              <CardContent style={{ display: 'flex', justifyContent: 'space-between', }}>
                <Typography variant="body2" color="text.secondary">
                  <h2>Name:</h2>
                  <h2>Email:</h2>
                  <h2>Id:</h2>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <h2>{user?.username}</h2>
                  <h2>{user?.email}</h2>
                  <h2>{user?._id.substring(0, 4)}</h2>
                </Typography>
              </CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'center', margin: '20px' }}>
                <Button onClick={handleOpen} variant="contained" color="primary">
                  Reset Password
                </Button>

                <Modal open={open} onClose={handleClose}>
                  <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4, width: 400 }}>
                    <h2>Reset Password</h2>
                    <TextField
                      name="Password"
                      label="Old Pasword" 
                      value={checkPassword} 
                     onChange={handleChange}
                      variant="outlined" fullWidth margin="normal" />
                    <TextField 
                    name="New-Password" label="New Pasword" 
                    variant="outlined"
                    value={newPassword}
                    onChange={handleChange}
                     fullWidth margin="normal" />
                    <TextField name="Confirm-Password"
                     label="Confirm-Pasword" 
                     variant="outlined" 
                     value={confirmPassword}
                     onChange={handleChange}
                     fullWidth margin="normal" />
                    <Button onClick={handleSubmit} variant="contained" color="primary" fullWidth>
                      Submit
                    </Button>
                  </Box>
                </Modal>
              </Box>
            </Card>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default Profile