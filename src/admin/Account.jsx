import { Box, Button, Modal, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Sidenav from '../component/Sidenav'
import Navbar from '../component/Navbar'
import DeleteIcon from '@mui/icons-material/Delete';
import { BASE_URL } from '../config/ipconfig';

function Account() {
  const [open, setOpen] = useState(false);
  const [account, setAccount] = useState([])
  const [formData, setFormData] = useState({
    accountName: '',
    accountDomain: ''
  })
  const token = localStorage.getItem('token');

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
      myHeaders.append("Authorization", `Bearer ${token}`);
      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(formData),
        redirect: 'follow',
      };
      fetch('http://localhost:9000/api/admin/createAccount', requestOptions)
      console.log('check Account',requestOptions)
      alert('Account created Successfully')
      window.location.reload()
      handleClose();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    const getAllAccount = async () => {
      try {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${token}`)

        const requestOptions = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow'
        };
        const response = await fetch(`${BASE_URL}/admin/getAccount`, requestOptions);
        const result = await response.json();
        const finalData = result.accounts;
        console.log('check..........',result)
        setAccount(finalData);


      } catch (error) {
        console.error('Error fetching timesheet data:', error);
      }
    };

    getAllAccount();
  }, []);

  const handleDelete = (deleteId) => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${token}`);
      const requestOptions = {
        method: "DELETE",
        headers:myHeaders,
        redirect: "follow"
      };
      fetch(`${BASE_URL}/admin/deleteAccount/${deleteId}`, requestOptions)
        .then((response) => response.text())
        .then((result) => {
          alert('Delete Successful');
          // console.log(result);
          // Optionally, update the project state after deletion
          const updatedAccount = account.filter((data) => data._id !== deleteId);
          setAccount(updatedAccount);
        })
        .catch((error) => console.error(error))
    } catch (error) {
      console.error('Error:', error);
    }
  }

  return (
    <>
      <Navbar />
      <Box height={30} />
      <Box sx={{ display: 'flex' }}>
        <Sidenav />

        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <h1>Account</h1>
          <Button onClick={handleOpen} sx={{ float: 'right', marginRi: '10px' }} variant="contained"
            color="primary"
            size="small">Create Account</Button>
          <Modal open={open} onClose={handleClose}>
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4, width: 400 }}>
              <h2>Create Account</h2>
              <TextField name="accountName" label="AccountName" variant="outlined" value={formData.accountName} onChange={handleChange} fullWidth margin="normal" />
              <TextField name="accountDomain" label="AccountDomain" variant="outlined" value={formData.accountDomain} onChange={handleChange} fullWidth margin="normal" />

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
                    <TableCell sx={{ fontWeight: 'bold' }}>Account Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Account Domain</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Created At</TableCell>

                    {/* <TableCell sx={{ fontWeight: 'bold' }}>CheckBox</TableCell> */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {account?.map((data, index) => (
                    <TableRow key={data._id}>
                      <TableCell>{data.accountName}</TableCell>

                      <TableCell>{data.accountDomain}</TableCell>
                      <TableCell> {new Date(data.createdAt).toLocaleString()}</TableCell>
                      <TableCell > <DeleteIcon onClick={() => handleDelete(data._id)}
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

export default Account