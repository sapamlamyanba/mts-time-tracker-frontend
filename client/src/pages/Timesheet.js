import { Box, Button } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import Sidenav from '../component/Sidenav'
import Navbar from '../component/Navbar'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import AppBarComponent from '../component/AppBar';
import { useSelector } from 'react-redux';
import AdminTimesheets from '../admin/AdminTimesheets';

function Timesheet() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7);
  const [currentPageItems, setCurrentPageItems] = useState([]);
  const [timesheets, setTimesheets] = useState([]);
  const { user } = useSelector(state => state.user)  
  const [hours, setHours] = useState('');

  const token = localStorage.getItem('token');
 
  useEffect(() => {
    const fetchTimesheetData = async () => {
      try {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${token}`);

        const requestOptions = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow'
        };
        const response = await fetch(`http://localhost:8000/api/user/getTimesheet`, requestOptions);
        const result = await response.json();
        const finalData = result.data;
        console.log('chekckkk', result)
        setTimesheets(finalData)
      } catch (error) {
        console.error('Error fetching timesheet data:', error);
      }
    };
    fetchTimesheetData();
  }, []);


  useEffect(() => {
    
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = timesheets?.slice(indexOfFirstItem, indexOfLastItem);
    setCurrentPageItems(currentItems);
  }, [timesheets, currentPage, itemsPerPage]);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  //---------------------------

  const handleUpdate = async (id, status, hours) => {
    try {
      const requestOptions = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: status, hours: hours })
      };

      const response = await fetch(`http://localhost:8000/api/user/updateTimesheet/${id}`, requestOptions);
      if (response.ok) {
        setTimesheets(prevTimesheets => {
          const updatedTimesheets = prevTimesheets?.map(timesheet => {
            if (timesheet._id === id) {
              return { ...timesheet, status: status, hours: hours };
            }
            return timesheet;
          });
          return updatedTimesheets;
        });
        console.log('Timesheet updated successfully');
      } else {
        console.error('Failed to update timesheet:', response.statusText);
      }
    } catch (error) {
      console.error('Error while updating timesheet:', error);
    }
  };

  const handleHourChange = (id, value) => {
    const updatedTimesheets = timesheets?.map(timesheet => {
      if (timesheet._id === id) {
        return { ...timesheet, hours: value };
      }
      return timesheet;
    });
    setTimesheets(updatedTimesheets);
    setHours(value);
  };

  return (
    <>
      <Navbar />
      <Box height={30} />
      <Box sx={{ display: 'flex' }}>
        <Sidenav />
        <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: '#EDF3F3' }}>
          {user && user.username === 'Admin' ? (
            <AdminTimesheets />
          ) : (
            <div style={{ marginTop: '20px' }}>
              <AppBarComponent />
              <TableContainer style={{backgroundColor:'#F6FCFC'}} component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="caption table">
                  <TableHead>
                    <TableRow style={{backgroundColor: '#EDF3F3'}}>
                      <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Project</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Task</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Task Summary</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Hours</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>


                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentPageItems?.map((row, index) => (

                      <TableRow key={row._id}>
                        <TableCell>
                          {new Date(row.createdAt).toLocaleDateString()}
                        </TableCell>

                        <TableCell>{row.project}</TableCell>
                        <TableCell>{row.task}</TableCell>
                        <TableCell>{row.shortdesc}</TableCell>

                        {row?.status === "Approved" || row?.status === "Submitted" ? (
                          <TableCell>{row.hours}</TableCell>
                        ) : (
                          <TableCell>
                            <input
                              style={{ width: '30px' }}
                              type="text"
                              value={row.hours || ''}
                              onChange={(e) => handleHourChange(row._id, e.target.value)}
                            /></TableCell>
                        )}

                        <TableCell>{row.status}</TableCell>
                        <TableCell>
                          {row.status === "New"  && (
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => handleUpdate(row._id, 'Submitted', hours)}
                            >
                              Update
                            </Button>
                          )}
                          {row.status === "Rejected"  && (
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => handleUpdate(row._id, 'Submitted', hours)}
                            >
                              Update
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <Button disabled={currentPage === 1} onClick={() => paginate(currentPage - 1)}>Previous</Button>
                <span style={{ margin: '0 10px' }}>{currentPage}</span>
                <Button disabled={currentPageItems?.length < itemsPerPage} onClick={() => paginate(currentPage + 1)}>Next</Button>

              </div>
            </div>
          )}
        </Box>
      </Box></>
  )
}

export default Timesheet