import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Modal, TextField, MenuItem } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Sidenav from '../component/Sidenav'
import Navbar from '../component/Navbar'
import DeleteIcon from '@mui/icons-material/Delete';

function User() {
  const [users, setUsers] = useState([])
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    account: '',
    password: '',
    isManager: false,
  });
  const [accountOptions, setAccountOptions] = useState([]);
  

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
        // console.log(finalData)
        const usersWithAccountNames = await Promise.all(finalData.map(async (user) => {
          if (user.account) {
            const accountName = await getAccountName(user.account);
            return { ...user, accountName };
          } else {
            return { ...user, accountName: 'Unknown' }; 
          }
        }));
        // console.log('checkuserData', finalData)
        setUsers(usersWithAccountNames);
      } catch (error) {
        console.error('Error fetching timesheet data:', error);
      }
    };
    getAllUsers();
  }, []);

  const getAccountName = async (accountId) => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`)

      const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };
      const response = await fetch(`http://localhost:8000/api/admin/getAccount/${accountId}`,requestOptions);
     
      const data = await response.json();
      const finalData = data.data ? data.data.accountName : 'Unknown';
      return finalData;
    } catch (error) {
      console.error('Error fetching account name:', error);
      return 'Unknown';
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = async () => {
    try {
      if (!formData.username || !formData.email || !formData.account || !formData.password ) {
        alert('Please fill in all fields');
        return;
      }
      const myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');

      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(formData),
        redirect: 'follow',
      };
      fetch('http://localhost:8000/api/user/signup', requestOptions)
      alert('User created Successfully')
      window.location.reload()
      handleClose();
    } catch (error) {
      console.error('Error:', error);
    }
  }

  useEffect(() => {
    const getAllAccount = async () => {
      try {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`)

        const requestOptions = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow'
        };
        const response = await fetch("http://localhost:8000/api/admin/getAccount", requestOptions);
        const result = await response.json();
        const finalData = result.accounts;
        setAccountOptions(finalData);
        // console.log('check..........', finalData)



      } catch (error) {
        console.error('Error fetching timesheet data:', error);
      }
    };

    getAllAccount();
  }, []);

  const handleDelete = () => {

  }
  return (
    <>
      <Navbar />
      <Box height={30} />
      <Box sx={{ display: 'flex' }}>
        <Sidenav />

        <Box style={{ backgroundColor: '#EDF3F3' }} component="main" sx={{ flexGrow: 1, p: 3 }}>
          <h2>Users</h2>
          <Button onClick={handleOpen} sx={{ float: 'right', marginRi: '10px' }} variant="contained"
            color="primary"
            size="small">Create Users</Button>

          <Modal open={open} onClose={handleClose}>
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4, width: 400 }}>
              <h2>Create User</h2>
              <TextField name="username" label="Username" variant="outlined" value={formData.username} onChange={handleChange} fullWidth margin="normal" />
              <TextField name="email" label="Email" variant="outlined" value={formData.email} onChange={handleChange} fullWidth margin="normal" />
              <TextField
                select
                name="account"
                label="Account"
                variant="outlined"
                value={formData.account}
                onChange={handleChange}
                fullWidth
                margin="normal"
              >
                {accountOptions.map((option) => (
                  < MenuItem key={option._id} value={option._id}>
                    {option.accountName}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                name="isManager"
                label="Is Manager"
                variant="outlined"
                value={formData.isManager}
                onChange={handleChange}
                fullWidth
                margin="normal"
              >
                <MenuItem value={true}>Yes</MenuItem>
                <MenuItem value={false}>No</MenuItem>
              </TextField>

              <TextField name="password" label="Password" variant="outlined" value={formData.password} onChange={handleChange} fullWidth margin="normal" />
              <Button onClick={handleSubmit} variant="contained" color="primary" fullWidth>
                Submit
              </Button>
            </Box>
          </Modal>
          <div>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="caption table">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Id</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Username</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Account</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Created On</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>{user._id}</TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      
                      <TableCell>
                     {user.accountName}
                      </TableCell>
                      <TableCell>{user.createdAt}</TableCell>
                      
                    </TableRow>
                  ))}


                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </Box>
      </Box></>
  )
}

export default User