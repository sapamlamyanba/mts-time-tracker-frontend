import { Box } from '@mui/material'
import React from 'react'
import Sidenav from '../component/Sidenav'
import Navbar from '../component/Navbar'
import AppbarComponent from '../component/AppBar'

function ManagerTimesheets() {
  return (
    <>
    <Navbar/>
    <Box height={30}/>
    <Box sx={{display:'flex'}}>
      <Sidenav/>        
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      
      

      
      </Box>
    </Box></>
  )
}

export default ManagerTimesheets