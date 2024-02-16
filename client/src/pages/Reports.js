import { Box } from '@mui/material'
import React from 'react'
import Sidenav from '../component/Sidenav'
import Navbar from '../component/Navbar'

function Reports() {
  return (
    <>
    <Navbar/>
    <Box height={30}/>
    <Box sx={{display:'flex'}}>
      <Sidenav/>
     
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <h1>Reports</h1>
      </Box>
    </Box></>
  )
}

export default Reports