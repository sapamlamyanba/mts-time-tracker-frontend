import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { IconButton, MenuItem, Select, } from '@mui/material';
import Navbar from './Navbar';
import { useSelector } from 'react-redux';
import ArrowBackIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIcon from '@mui/icons-material/ArrowForwardIos';




export default function AppbarComponent() {
  const [isMenuOpen, setMenuOpen] = React.useState(false);
  const [project, setProject] = React.useState([])
  const [date, setDate] = React.useState([])
  const [selectedProject, setSelectedProject] = React.useState('');
  const [selectedTask, setSelectedTask] = React.useState('');
  const [selectedDate, handleDateChange] = React.useState(null);
  const [xyz, setXyz] = React.useState(Array(7).fill(''));
  const [currentWeek, setCurrentWeek] = React.useState(new Date());
  const [tasks, setTasks] = React.useState([]);
  const { user } = useSelector((state) => state.user);
  const token = localStorage.getItem('token');
  





  const handleMenuItemClick1 = async (option, type) => {
    // console.log(option)
    if (type === 'projectName') {
      setSelectedProject(option.projectName);
      setSelectedTask('');
      setMenuOpen(false);
      try {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);
      const requestOptions = {
        method: "GET",
        headers:myHeaders,
        redirect: "follow"
      };
      // console.log('checkOption',option.id)
        const response = await fetch(`http://localhost:8000/api/admin/getTask/${option.id}`,requestOptions);
        if (!response.ok) {
          throw new Error('Failed to fetch tasks for the selected project');
        }
        const data = await response.json();
        setTasks(data.task);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    } else if (type === 'task') {
      setSelectedTask(option);
      setMenuOpen(false);
    }
  };

  const RenderDates = ({ startingDate, selectedTimes, setSelectedTimes }) => {
    const dates = [];
    const startingSundayDate = new Date(startingDate);
    startingSundayDate.setDate(startingSundayDate.getDate() - startingSundayDate.getDay());

    for (let i = 0; i < 7; i++) {
      const tempDate = new Date(startingSundayDate);
      tempDate.setDate(tempDate.getDate() + i);
      dates.push(tempDate);
    }
    const handleChange = (e, index) => {
      const { value } = e.target;
      const newXyz = [...selectedTimes];
  
      if (!isNaN(value) && value !== '') {
        newXyz[index] = parseInt(value);
      } else {
        newXyz[index] = null;
      }        
      e.target.value = newXyz[index] || '';
      setSelectedTimes(newXyz);
    };
  
    const handleBlur = (e, index) => {     
      setSelectedTimes([...selectedTimes]);
    };
    return (
      <div style={{
        display: 'flex', flexDirection: 'row', position: 'absolute', marginLeft: '340px',
        borderWidth: 1, borderColor: 'black', backgroundColor: '#FCFAFA'
      }}>
        {dates.map((date, index) => (
          <div key={index} style={{
            padding: '10px', fontSize: '10px', display: 'flex', flexDirection: 'column', color: 'black',
          }}>
            <div style={{ textAlign: 'center' }}>

              {date.toLocaleDateString('en-US', { weekday: 'short' })}
            </div>
            <div style={{ textAlign: 'center' }}>

              {date.toLocaleDateString('en-US', { day: 'numeric' })}
              {date.toLocaleDateString('en-US', { month: 'short' })}
            </div>
            <div>
            <input
              id={`xyz[${index}]`}
              type="number"
              name={`xyz[${index}]`}
              value={selectedTimes[index] || ''}
              onChange={(e) => handleChange(e, index)}
              onBlur={(e) => handleBlur(e, index)}
              style={{ marginLeft: '0px', width: '70px', height: '40px', border: 'none', outline: 'none', textAlign: 'center' }}
            />

            </div>
          </div>
        ))}
      </div>
    );
  };

  React.useEffect(() => {
    const fetchProjectData = async () => {
      try {
        if (!user || !token) {
          console.error('User or token is null or undefined');
          return;
        }
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${token}`)   
        const account = user?.account;
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
        const result = await response.json();
        const finalData = result.projects;               
        const projects = finalData?.map((project) => ({
          id: project._id,
          projectName: project.projectName,
        }));
        setProject(projects);
      } catch (error) {
        console.error('Error fetching timesheet data:', error);
      }
    };

  //   console.log('User:', user);
  // console.log('Token:', token);
    
  if (user) {
    fetchProjectData();
  }
  }, [token, user]);


  const handleAddButtonClick = async (e) => {
    e.preventDefault();

    const startingSundayDate = new Date(currentWeek);
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const tempDate = new Date(startingSundayDate);
      tempDate.setDate(tempDate.getDate() + i);
      dates.push(tempDate.toISOString());
    }
    setDate(dates);
    if (!selectedProject) {
      console.error('Please fill in all required fields');
      alert('Please fill in all required fields');
      return;
    }
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);
    try {
      const userid = user._id;
      const timesheetEntries = [];
      for (let i = 0; i < 7; i++) {
        const currentDate = new Date(currentWeek);
        currentDate.setDate(currentDate.getDate() + i);

        const entry = {
          date: currentDate.toISOString(),
          project: selectedProject,
          task: selectedTask,
          shortdesc: 'Check',
          xyz: [xyz[i]],
        };
        timesheetEntries.push(entry);
      }
      // const selectedProjectObj = project.find(p => p.projectName === selectedProject);
      const selectedProjectObj = project.find(p => p.projectName === selectedProject && p.accountId === user.account);

      const requestBody = {
        userId: userid,
        timesheetEntries: timesheetEntries,
        selectedProject: selectedProjectObj,
        selectedTask: selectedTask,
      };

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(requestBody),
        redirect: 'follow'
      };

      const response = await fetch('http://localhost:8000/api/user/createTimesheet', requestOptions);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      window.location.reload();
    } catch (error) {
      console.error('Error during API call:', error);
    }
  }

  const handleWeekChange = (direction) => {
    const newWeek = new Date(currentWeek);
    if (direction === 'next') {
      newWeek.setDate(newWeek.getDate() + 7);
    } else if (direction === 'previous') {
      newWeek.setDate(newWeek.getDate() - 7);
    }
    setCurrentWeek(newWeek);
    
  };


  return (

    <>

      <AppBar position="static" sx={{ background: '#F6FCFC', height: '120px', marginBottom: '10px' }}>

        <div style={{ display: 'flex', flexDirection: 'row' }}>

          <Typography variant="h6" component="div" sx={{ flexGrow: 0.9, color: 'grey', marginLeft: '0px' }}>
            <div style={{ display: 'flex', flexDirection: 'row', marginTop: '20px', }}>

              <div style={{ display: 'flex', flexDirection: 'row', marginLeft: '0px', marginTop: '10px' }}>


                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ marginLeft: '60px' }}>Project</span>
                  <Select
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    displayEmpty
                    sx={{ marginLeft: '50px', height: '40px', width: '120px', border: 'none' }}
                  >
                    <MenuItem value="" disabled>
                      Project
                    </MenuItem>
                    {project?.map((option, index) => (
                      <MenuItem key={index} value={option.id} onClick={() => handleMenuItemClick1(option, 'projectName')}>
                        {option.projectName}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ marginLeft: '60px' }}>Task</span>
                  <Select

                    value={selectedTask}
                    onChange={(e) => setSelectedTask(e.target.value)}
                    displayEmpty
                    sx={{ marginLeft: '50px', height: '40px', width: '100px' }}
                  >
                    <MenuItem value="" disabled>
                      Task
                    </MenuItem>
                    {tasks.map((task, index) => (
                      <MenuItem key={index} value={task.taskName} onClick={() => handleMenuItemClick1(task, 'task')}>
                        {task.taskName}
                      </MenuItem>
                    ))}
                  </Select>
                </div>

              </div>
              <RenderDates
                startingDate={currentWeek}
                selectedTimes={xyz}
                setSelectedTimes={setXyz}
                setDateCallback={handleDateChange}
              />     </div>
          </Typography>
          <IconButton style={{ marginLeft: '600px' }} size="small" onClick={() => handleWeekChange('previous')} color="black">
            <ArrowBackIcon />
          </IconButton>
          <h6>Date </h6>
          <IconButton size="small" onClick={() => handleWeekChange('next')} color="black" style={{ marginRight: '0px' }}>
            <ArrowForwardIcon />
          </IconButton>

          <Button onClick={handleAddButtonClick} style={{
            backgroundColor: '#1976D2',
            color: 'white',
            padding: '2px',
            margin: '28px',
            marginTop: '30px',
            width: '100px',
            minWidth: '50px',
          }}>
            Submit
          </Button>
        </div>
      </AppBar>



    </>

  );
}
