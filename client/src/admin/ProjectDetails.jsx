import { Box, Button, Modal, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Sidenav from '../component/Sidenav'
import Navbar from '../component/Navbar'
import { useParams } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';

function ProjectDetails() {
    const { projectId } = useParams();
    const [projectDetails, setProjectDetails] = useState([]);
    const [task, setTask] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        taskName: '',
        taskDescription: ''

    });
    const token = localStorage.getItem('token');

    const handleSubmit = async () => {
        try {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", `Bearer ${token}`);
            const requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify({
                    projectId: projectId,
                    taskName: formData.taskName,
                    taskDescription: formData.taskDescription
                }),
                redirect: 'follow',
            };
            fetch('http://localhost:8000/api/admin/createTask', requestOptions)
            alert('Task created Successfully')
            window.location.reload();
            handleClose();
        } catch (error) {
            console.error('Error:', error);
        }
    };
    useEffect(() => {
        const fetchProjectDetails = async () => {
            try {
                const myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");
                myHeaders.append("Authorization", `Bearer ${token}`);
                const requestOptions = {
                    method: 'GET',
                    headers: myHeaders,
                    redirect: 'follow',
                  };
                const response = await fetch(`http://localhost:8000/api/admin/getProject/${projectId}`, requestOptions);
                if (!response.ok) {
                    throw new Error('Failed to fetch project details');
                }
                const data = await response.json();
                setProjectDetails(data.data);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchProjectDetails();
    }, [projectId]);

    useEffect(() => {
        const getTask = async () => {
            try {
                const myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");
                 myHeaders.append("Authorization", `Bearer ${token}`);
                const requestOptions = {
                    method: 'GET',
                    headers: myHeaders,
                    redirect: 'follow'
                };

                const response = await fetch(`http://localhost:8000/api/admin/getTask/${projectId}`, requestOptions);
                const result = await response.json();
                const finalData = result.task;
                setTask(finalData);
            } catch (error) {
                console.error('Error fetching timesheet data:', error);
            }
        };

        getTask();
    }, [projectId]);


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

    const handleDelete = (taskId) => {
        try {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${token}`);
            const requestOptions = {
                method: "DELETE",
                headers: myHeaders,
                redirect: "follow"
            };
            fetch(`http://localhost:8000/api/admin/deleteTask/${taskId}`, requestOptions)
                .then((response) => response.text())

                .then((result) => {
                    alert('Delete Successfull')
                    const updatedProjects = task.filter((data) => data._id !== taskId);
                    setTask(updatedProjects);
                    console.log(result)
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

                <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop: '20px' }}>
                    <h3>Projects </h3>
                    <h1 style={{ color: 'grey', fontFamily: 'sans-serif' }}>{projectDetails.projectName}</h1>
                    <Button onClick={handleOpen} sx={{ float: 'right', marginRi: '10px' }} variant="contained"
                        color="primary"
                        size="small">Create Task</Button>

                    <Modal open={open} onClose={handleClose}>
                        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4, width: 400 }}>
                            <h2>Create User</h2>
                            <TextField name="taskName" label="TaskName" variant="outlined" value={formData.taskName} onChange={handleChange} fullWidth margin="normal" />
                            <TextField name="taskDescription" label="TaskDescription" variant="outlined" value={formData.taskDescription} onChange={handleChange} fullWidth margin="normal" />
                            <Button onClick={handleSubmit} variant="contained" color="primary" fullWidth>
                                Submit
                            </Button>
                        </Box>
                    </Modal>
                    <div>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="caption table">
                                <TableHead>
                                    <TableRow style={{ background: '#DBE3E3' }}>
                                        <TableCell>Task</TableCell>
                                        <TableCell></TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold', color: 'grey', fontFamily: 'sans-serif' }}> NAME</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', color: 'grey', fontFamily: 'sans-serif' }}> Description</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {task.map((data, index) => (
                                        <TableRow>
                                            <TableCell >{data.taskName}</TableCell>
                                            <TableCell>{data.taskDescription}</TableCell>
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

export default ProjectDetails