import { Box, Button, Modal, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Sidenav from '../component/Sidenav'
import Navbar from '../component/Navbar'
import { useNavigate, useParams } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';


function Project() {
  const [open, setOpen] = useState(false);
  const [project, setProject] = useState([])
  const token = localStorage.getItem('token');

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
      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(formData),
        redirect: 'follow',
      };
      fetch('http://localhost:8000/api/admin/createProject', requestOptions)
      alert('Project created Successfully')
      window.location.reload()
      handleClose();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    const getAllProjects = async () => {
      try {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`)

        const requestOptions = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow'
        };
        const response = await fetch("http://localhost:8000/api/admin/getProject", requestOptions);
        const result = await response.json();
        const finalData = result.projects;
        // console.log('check..........',result)
        setProject(finalData);


      } catch (error) {
        console.error('Error fetching timesheet data:', error);
      }
    };

    getAllProjects();
  }, []);

  const handleClickProject = (projectId) => {
    navigate(`/project/${projectId}`);

  }

  const handleDelete = (projectId) => {
    try {
      const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);
      const requestOptions = {
        method: "DELETE",
        headers:myHeaders,
        redirect: "follow"
      };
      fetch(`http://localhost:8000/api/admin/deleteProject/${projectId}`, requestOptions)
        .then((response) => response.text())
        .then((result) => {
          alert('Delete Successful');
          console.log(result);
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
              <h2>Create User</h2>
              <TextField name="projectName" label="ProjectName" variant="outlined" value={formData.projectName} onChange={handleChange} fullWidth margin="normal" />
              <TextField name="projectDescription" label="ProjectDescription" variant="outlined" value={formData.projectDescription} onChange={handleChange} fullWidth margin="normal" />

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
                    <TableCell sx={{ fontWeight: 'bold' }}>Created At</TableCell>

                    {/* <TableCell sx={{ fontWeight: 'bold' }}>CheckBox</TableCell> */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {project?.map((data, index) => (
                    <TableRow key={data._id}>
                      <TableCell onClick={() => handleClickProject(data._id)}>{data.projectName}</TableCell>

                      <TableCell>{data.projectDescription}</TableCell>
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