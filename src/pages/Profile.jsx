import { Avatar, Box, Button, Card, CardContent, CardHeader, CardMedia, IconButton, Typography } from '@mui/material'
import React from 'react'
import Sidenav from '../component/Sidenav'
import Navbar from '../component/Navbar'
import { useSelector } from 'react-redux'
import { red } from '@mui/material/colors'
import { useNavigate } from 'react-router-dom'

function Profile() {
  const { user } = useSelector(state => state.user)
  const text = user?.username ? user.username.substring(0, 1) : '';
  const navigate = useNavigate();

  return (
    <Box style={{ backgroundColor: '#EDF3F3', minHeight: '20vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <Box  height={30} />
      <Box sx={{ display: 'flex',backgroundColor: '#EDF3F3', paddingBottom:'250px' }}>
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
                <Button onClick={()=> navigate('/resetPassword')} variant="contained" color="primary">
                  Reset Password
                </Button>
              </Box>
            </Card>
          </Box>
        </Box>
      </Box>
      </Box>
  )
}

export default Profile