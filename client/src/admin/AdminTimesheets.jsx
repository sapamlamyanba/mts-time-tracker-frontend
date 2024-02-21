
import React, { useCallback, useEffect, useState } from 'react'
import { Box, FormControl, InputLabel, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, FormControlLabel, Checkbox, Button } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

function AdminTimesheets() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState('');
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [isCheckedAll, setIsCheckedAll] = useState(false);
  const [checkedItems, setCheckedItems] = useState({});
  const token = localStorage.getItem('token');
  
  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);
        const requestOptions = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow'
        };
        const response = await fetch("http://localhost:8000/api/admin/getAllUsers", requestOptions);
        const result = await response.json();
        const finalData = result.data;       
        setUsers(finalData);
        setLoading(false);
        finalData.forEach(async (user) => {        
          const projectName = await getProjectName(user.account);       
        });
        if (finalData.length > 0) {
          setSelectedUser(finalData[0]._id);
          fetchUserData(finalData[0]._id);
        }
      } catch (error) {
        // console.error('Error fetching data:', error);
        setError('Failed to fetch data. Please try again later.');
        setLoading(false);
      }
    };
    getAllUsers();
  }, []);


  const fetchUserData = async (userId) => {
    
    try {
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);
      const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };
      const response = await fetch(`http://localhost:8000/api/admin/getUser/${userId}`, requestOptions);
      const result = await response.json();
      // console.log('checkUser',result.data)
      setUserData(result.data);
    } catch (error) {
      
    }
  };

  const getProjectName = useCallback(async (account) => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`)
      const raw = JSON.stringify({
        "account": account
      });
      
      const requestOptions = {
        method: 'POST',
        body: raw,
        headers: myHeaders,
        redirect: 'follow'
      };
      const response = await fetch("http://localhost:8000/api/admin/getProject", requestOptions);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }   
      const data = await response.json();
      const finalData = data.project;
      const projectName = finalData ? finalData.projectName : 'Unknown';
      return projectName;
    } catch (error) {
      // console.error('Error fetching account name:', error);
      return 'Unknown';
    }
  }, [token]);

  const handleUserChange = useCallback((event) => {
    const userId = event.target.value;
    setSelectedUser(userId);
    fetchUserData(userId);
  },[fetchUserData]);

  const handleApprove = async (id) => {
    try {
      const requestOptions = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ id }) 
      };

      const response = await fetch(`http://localhost:8000/api/user/timesheets/${id}/approve`, requestOptions);
      if (response.ok) {
        window.location.reload();
        
      } else {
       
        console.error('Failed to approve timesheet:', response.statusText);
        
      }
    } catch (error) {
      console.error('Error while approving timesheet:', error);
    }
  };

  const handleReject = async (id) => {
    try {
      const requestOptions = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ id }) 
      };

      const response = await fetch(`http://localhost:8000/api/user/timesheets/${id}/reject`, requestOptions);
      if (response.ok) {
        window.location.reload();
        
      } else {
        
        console.error('Failed to approve timesheet:', response.statusText);
       
      }
    } catch (error) {
      console.error('Error while approving timesheet:', error);
      
    }
  };

  const handleCheckboxChange = useCallback((event, id) => {
    const { checked } = event.target;
    setCheckedItems(prevState => ({
      ...prevState,
      [id]: checked,
    }));
  },[]);

  const handleCheckAllChange = useCallback((event) => {
    const { checked } = event.target;
    setIsCheckedAll(checked);
    const updatedCheckedItems = {};
    userData.forEach(timesheet => {
      updatedCheckedItems[timesheet._id] = checked;
    });
    setCheckedItems(updatedCheckedItems);
  },[userData]);
  const ErrorMessage = ({ message }) => {
    return (
      <div className="error-message">
        <p>{message}</p>
      </div>
    );
  };


  return (
    <Box sx={{ padding: '25px', backgroundColor: '#EDF3F3' }}>
        {loading &&  <CircularProgress />}
        {error && <ErrorMessage message={error} />}
      <FormControl style={{ width: '150px', textAlign: 'center' }}>
        <InputLabel style={{ textAlign: 'center', alignItems: 'center' }}>Select User</InputLabel>
        <Select
          style={{ margin: '10px' }}
          value={selectedUser}
          onChange={handleUserChange}
        >
          {users.map((user) => (
            <MenuItem key={user._id} value={user._id}>{user.username}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {userData && users.map(item => (
        item._id === selectedUser && (
          <div key={item._id}>
            <div>
              <h4>Username: {item.username}</h4>
              <h4>Email: {item.email}</h4>
            </div>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow style={{backgroundColor: '#EDF3F3'}}>
                    <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Project</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Task</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Short Description</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Hours</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>All  <Checkbox
                      checked={isCheckedAll}
                      onChange={handleCheckAllChange}
                    /></TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}> Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {userData.filter(row => row.hours !== null).map(timesheet => (
                    <TableRow key={timesheet._id}>
                      <TableCell> {new Date(timesheet.date).toLocaleDateString()}</TableCell>
                      <TableCell>{timesheet.project}</TableCell>
                      <TableCell>{timesheet.task}</TableCell>
                      <TableCell>{timesheet.shortdesc}</TableCell>
                      <TableCell>{timesheet.hours}</TableCell>
                      <TableCell>{timesheet.status}</TableCell>

                      <TableCell>
                        <Checkbox
                          checked={checkedItems[timesheet._id] || false}
                          onChange={(event) => handleCheckboxChange(event, timesheet._id)}
                          disabled={timesheet.status === 'Approved'}
                        />
                      </TableCell>
                      <TableCell>
                        {timesheet.status === 'New' || timesheet.status === 'Submitted' ? (
                          <>
                            <Button
                              onClick={() => handleApprove(timesheet._id)}
                              variant="contained"
                              color="primary"
                              size="small"
                              disabled={!checkedItems[timesheet._id]}

                            >
                              Approve
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              size="small"
                              onClick={() => handleReject(timesheet._id)}
                              disabled={!checkedItems[timesheet._id]}
                            >
                              Reject
                            </Button>
                          </>
                        ) : timesheet.status === 'Rejected' ? (
                          <Button
                            onClick={() => handleApprove(timesheet._id)}
                            variant="contained"
                            color="primary"
                            size="small"
                          >
                            Approve
                          </Button>
                        ) : timesheet.status === 'Approved' ? (
                          <Button
                            onClick={() => handleReject(timesheet._id)}
                            variant="contained"
                            color="error"
                            size="small"
                            disabled={!checkedItems[timesheet._id]}
                          >
                            Reject
                          </Button>
                        ) : (
                          <>
                            <Button
                              disabled
                              onClick={() => handleApprove(timesheet._id)}
                              variant="contained"
                              color="primary"
                              size="small"
                            >
                              Approve
                            </Button>
                            <Button
                              disabled
                              variant="contained"
                              color="error"
                              size="small"
                              onClick={() => handleReject(timesheet._id)}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        )
      ))}

    </Box>
  )
}

export default AdminTimesheets