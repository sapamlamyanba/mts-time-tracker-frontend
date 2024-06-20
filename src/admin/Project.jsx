import { Box, Button, FormControl, InputLabel, MenuItem, Modal, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Sidenav from '../component/Sidenav'
import Navbar from '../component/Navbar'
import { useNavigate, useParams } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSelector } from 'react-redux';
import { BASE_URL } from '../config/ipconfig';


function Project() {
  const [open, setOpen] = useState(false);
  const [project, setProject] = useState([])
  const token = localStorage.getItem('token');
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [users, setUsers] = useState([])
  const { user } = useSelector(state => state.user)
  const [accounts, setAccounts] = useState([])




  const [formData, setFormData] = useState({
    projectName: '',
    projectDescription: '',

  });
  const navigate = useNavigate();

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
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${token}`);
      if (!selectedUsers) {
        console.error("No user selected");
        return;
      }
      const account = formData.account;
      console.log('checkAccount', account)
      const requestBody = { ...formData,  account: account };
      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(requestBody),
        redirect: 'follow',
      };
      fetch(`${BASE_URL}/admin/createProject`, requestOptions)
      alert('Project created Successfully')
      // console.log('check')
      window.location.reload()
      handleClose();
    } catch (error) {
      console.error('Error:', error);
    }
  };


  useEffect(() => {
    const fetchProjects = async () => {

      try {

        if (!user || !token) {
          console.error('User or token is null or undefined');
          return;
        }
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${token}`);
        const account = user?.account;
        console.log('account',account)
        const raw = JSON.stringify({
          "account": account
        });

        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow"
        };

        const response = await fetch(`${BASE_URL}/admin/getProject`, requestOptions);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        const projects = result.projects
        console.log('projects',projects)
        const usersWithAccountNames = await Promise.all(projects.map(async (user) => {
          if (user.account) {
            const accountName = await getAccountName(user.account);
            return { ...user, accountName };
          } else {
            return { ...user, accountName: 'Unknown' };
          }
        }));
        setProject(usersWithAccountNames);
      } catch (error) {
        console.error(error);
      }
    };
    if (user) {

      fetchProjects();
    }
  }, [user, token]);



  const getAccountName = async () => {
    try {

      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`)

      const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };
      const response = await fetch(`${BASE_URL}/admin/getAccount`, requestOptions);
      const data = await response.json();
      // console.log('data', data)
      // const finalData = data.data ? data.data.accountName : 'Unknown';
      const finalData = data
      console.log('data', finalData.accounts)
      setAccounts(finalData.accounts)
      // return finalData;
    } catch (error) {
      console.error('Error fetching account name:', error);
      return 'Unknown';
    }
  };
  useEffect(() => {
    getAccountName()
  }, [])


  const handleClickProject = (projectId) => {
    navigate(`/project/${projectId}`);

  }

  const handleDelete = (projectId) => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);
      const requestOptions = {
        method: "DELETE",
        headers: myHeaders,
        redirect: "follow"
      };
      fetch(`${BASE_URL}/admin/deleteProject/${projectId}`, requestOptions)
        .then((response) => response.text())
        .then((result) => {
          alert('Delete Successful');

          // Optionally, update the project state after deletion
          const updatedProjects = project.filter((data) => data._id !== projectId);
          setProject(updatedProjects);
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

        <Box style={{ backgroundColor: '#EDF3F3' }} component="main" sx={{ flexGrow: 1, p: 3 }}>
          <h1>Projects</h1>

          <Button onClick={handleOpen} sx={{ float: 'right', marginRi: '10px' }} variant="contained"
            color="primary"
            size="small">Create Project</Button>
          <Modal open={open} onClose={handleClose}>
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4, width: 400 }}>
              <h2>Create Project</h2>

              <TextField name="projectName" label="ProjectName" variant="outlined" value={formData.projectName} onChange={handleChange} fullWidth margin="normal" />
              <TextField name="projectDescription" label="ProjectDescription" variant="outlined" value={formData.projectDescription} onChange={handleChange} fullWidth margin="normal" />
              <FormControl fullWidth margin="normal" variant="outlined">
                <InputLabel id="account-select-label">Account</InputLabel>
                <Select
                  labelId="account-select-label"
                  id="account-select"
                  value={formData.account}
                  onChange={(event) => setFormData({ ...formData, account: event.target.value })}
                  label="Account"
                >
                  {accounts.map(account => (
                    <MenuItem key={account._id} value={account._id}>{account.accountName}</MenuItem>
                  ))}
                </Select>
              </FormControl>
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
                    <TableCell sx={{ fontWeight: 'bold' }}>Project Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Project Description</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Project Account</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Created At</TableCell>

                    {/* <TableCell sx={{ fontWeight: 'bold' }}>CheckBox</TableCell> */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {project?.map((data, index) => (
                    <TableRow key={data._id}>
                      <TableCell onClick={() => handleClickProject(data._id)}>{data.projectName}</TableCell>
                      <TableCell>{data.projectDescription}</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>{data.account} </TableCell>
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

export default Project