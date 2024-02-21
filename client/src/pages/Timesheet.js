import { Box } from '@mui/material'
import React from 'react'
import Sidenav from '../component/Sidenav'
import Navbar from '../component/Navbar'
import AppBarComponent from '../component/AppBar';
import { useSelector } from 'react-redux';
import AdminTimesheets from '../admin/AdminTimesheets';
import TimesheetComponent from '../component/TimesheetComponent';


function Timesheet() {
  const { user } = useSelector(state => state.user)

  return (
    <>
      <Navbar />
      <Box height={30} />
      <Box sx={{ display: 'flex' }}>
        <Sidenav />
        <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: '#EDF3F3' }}>
          {user?.isAdmin ? (
            <AdminTimesheets />
          ) : (
            <div style={{ marginTop: '20px' }}>
              <AppBarComponent />
              <TimesheetComponent />
            </div>
          )}
        </Box>
      </Box></>
  )
}

export default Timesheet