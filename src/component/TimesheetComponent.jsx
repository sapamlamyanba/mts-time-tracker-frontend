import { Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { BASE_URL } from '../config/ipconfig';


function TimesheetComponent() {

  const [timesheets, setTimesheets] = useState([]);
  const [hours, setHours] = useState('');
  const token = localStorage.getItem('token');
  const [currentStartDate, setCurrentStartDate] = useState('');
  const [currentEndDate, setCurrentEndDate] = useState('');




  const fetchTimesheets = async (startDate, endDate) => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${token}`);
      const raw = JSON.stringify({ startDate, endDate });
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };
      const response = await fetch(`${BASE_URL}/user/paginateTimesheets`, requestOptions);
      if (!response.ok) {
        throw new Error('Failed to fetch timesheets');
      }
      const data = await response.json();
      setTimesheets(data);

    } catch (error) {
      console.error('Error fetching timesheets:', error);
    }
  };

  const handleNext = () => {
    const nextStartDate = new Date(currentEndDate);
    nextStartDate.setDate(nextStartDate.getDate() + 1);
    const nextEndDate = new Date(nextStartDate);
    nextEndDate.setDate(nextEndDate.getDate() + 6);
    setCurrentStartDate(nextStartDate);
    setCurrentEndDate(nextEndDate);
    fetchTimesheets(nextStartDate.toISOString().substring(0, 10), nextEndDate.toISOString().substring(0, 10));
  };

  const handlePrevious = () => {
    const previousEndDate = new Date(currentStartDate);
    previousEndDate.setDate(previousEndDate.getDate() - 1);
    const previousStartDate = new Date(previousEndDate);
    previousStartDate.setDate(previousStartDate.getDate() - 6);
    setCurrentStartDate(previousStartDate);
    setCurrentEndDate(previousEndDate);
    fetchTimesheets(previousStartDate.toISOString().substring(0, 10), previousEndDate.toISOString().substring(0, 10));
  };

  useEffect(() => {
    const currentDate = new Date();
    const startDate = new Date(currentDate);
    startDate.setDate(currentDate.getDate() - currentDate.getDay());
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    startDate.setUTCHours(0, 0, 0, 0);
    endDate.setUTCHours(23, 59, 59, 999);
    setCurrentStartDate(startDate);
    setCurrentEndDate(endDate);
    fetchTimesheets(startDate.toISOString().substring(0, 10), endDate.toISOString().substring(0, 10));
  }, [token]);

  const handleHourChange = (id, value, value1) => {
    const updatedTimesheets = timesheets?.map(timesheet => {
      if (timesheet._id === id) {
        return { ...timesheet, hours: value, value1 };
      }
      return timesheet;
    });
    setTimesheets(updatedTimesheets);
    setHours(value);
  };
  const handleUpdate = async (id, status, hours, value1) => {
    try {
      const requestOptions = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: status, hours: hours, value1 })
      };
      const response = await fetch(`${BASE_URL}/user/updateTimesheet/${id}`, requestOptions);
      if (response.ok) {
        setTimesheets(prevTimesheets => {
          return prevTimesheets.map(timesheet => {
            if (timesheet._id === id) {
              return { ...timesheet, status, hours, value1 };
            }
            return timesheet;
          });
        });
        console.log('Timesheet updated successfully');
      } else {
        console.error('Failed to update timesheet:', response.statusText);
      }
    } catch (error) {
      console.error('Error while updating timesheet:', error);
    }
  };


  return (
    <>
      <div style={{
        display: 'flex', justifyContent: 'center',
        marginTop: '20px', textAlign: 'center', padding: '10px'
      }}>

        <Button onClick={handlePrevious}>Previous</Button>
        <h5> {currentStartDate.toString().substring(0, 10)} ----   {currentEndDate.toString().substring(0, 10)}</h5>
        <Button onClick={handleNext}>Next</Button>
      </div>
      <TableContainer style={{ backgroundColor: '#F6FCFC' }} component={Paper}>
        <Table aria-label="caption table">
          <TableHead>
            <TableRow >
              <TableCell>Date </TableCell>
              <TableCell style={{ paddingLeft: '15px' }}>Project</TableCell>
              <TableCell>Task</TableCell>
              <TableCell>Hours</TableCell>
              <TableCell>Comment</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {timesheets.filter(row => row.hours > 0).map((row, index) => (
              <React.Fragment key={row._id}>

                <TableRow style={{ height: '50px' }}>
                  <TableCell>
                    {new Date(row.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell style={{ paddingLeft: '10px' }}>
                    {row.project}
                  </TableCell>
                  <TableCell style={{ paddingLeft: '20px' }}>{row.task}</TableCell>
                  {row.status === "Approved" ? (
                    <TableCell>{row.hours}</TableCell>
                  ) : (
                    <TableCell>
                      <input
                        style={{ width: '30px' }}
                        type="text"
                        value={row.hours || ''}
                        onChange={(e) => handleHourChange(row._id, e.target.value)}
                      />
                    </TableCell>
                  )}
                  <TableCell>{row.comment}</TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell>
                    {row.status === 'rejected' && (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleUpdate(row._id, 'Updated', row.hours)}
                      >
                        Update
                      </Button>
                    )}
                  </TableCell>

                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div style={{ display: 'flex' }}>
        <h5>From: {currentStartDate.toString().substring(0, 10)} ----  to:  {currentEndDate.toString().substring(0, 10)}</h5>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', textAlign: 'center' }}>

        <button onClick={handlePrevious}>Previous</button>

        <button onClick={handleNext}>Next</button>
      </div>
    </>
  )
}

export default TimesheetComponent;
