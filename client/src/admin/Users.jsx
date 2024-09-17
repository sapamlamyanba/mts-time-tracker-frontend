import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Modal, TextField } from '@mui/material'
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
    password: '',
  });

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
      } catch (error) {
        console.error('Error fetching timesheet data:', error);
      }
    };
    getAllUsers();
  }, []);

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
      handleClose();
    } catch (error) {
      console.error('Error:', error);
    }
  };

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
                    <TableCell sx={{ fontWeight: 'bold' }}>Created On</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((data, index) => (
                    <TableRow key={data._id}>
                      <TableCell>{data._id}</TableCell>
                      <TableCell>{data.email}</TableCell>
                      <TableCell>{data.username}</TableCell>
                      <TableCell> {new Date(data.createdAt).toLocaleString()}</TableCell>
                      <TableCell > <DeleteIcon onClick={handleDelete}
                        sx={{
                          '&:hover': {
                            backgroundColor: '#f0f0f0',
                            cursor: 'pointer',
                          },
                        }} /></TableCell>

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