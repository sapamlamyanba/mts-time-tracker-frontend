import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Box, IconButton, MenuItem, Modal, Select, TextField, } from '@mui/material';
import { useSelector } from 'react-redux';
import ArrowBackIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIcon from '@mui/icons-material/ArrowForwardIos';
import { BASE_URL } from '../config/ipconfig';
import '../App.css'
import AlignHorizontalLeftIcon from '@mui/icons-material/AlignHorizontalLeft';





const AppbarComponent = () => {
  const [isMenuOpen, setMenuOpen] = React.useState(false);
  const [project, setProject] = React.useState([])
  const [selectedProject, setSelectedProject] = React.useState('');
  const [selectedTask, setSelectedTask] = React.useState('');
  const [currentWeek, setCurrentWeek] = React.useState(new Date());
  const [tasks, setTasks] = React.useState([]);
  const { user } = useSelector((state) => state.user);
  const token = localStorage.getItem('token');
  const [inputValues, setInputValues] = React.useState(Array(7).fill(''));
  const [comments, setComments] = React.useState(Array(7).fill(''));
  const [selectedInput, setSelectedInput] = React.useState(Array(7).fill(''));
  const [visibleCommentIndex, setVisibleCommentIndex] = React.useState(null);
  const [startingSundayDates, setStartingSundayDates] = React.useState(new Date());

  //-----------------Fetching Task---------------//
  const handleMenuItemClick = async (option, type) => {
    if (type === 'projectName') {
      setSelectedProject(option.projectName);
      setSelectedTask('');
      setMenuOpen(false);
      try {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);
        const requestOptions = {
          method: "GET",
          headers: myHeaders,
          redirect: "follow"
        };
        // console.log('checkOption',option.id)
        const response = await fetch(`${BASE_URL}/admin/getTask/${option.id}`, requestOptions);
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

  //-----------------Fetching Project---------------//
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
        const response = await fetch(`${BASE_URL}/admin/getProject`, requestOptions);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        const finalData = result.projects;
        const finalProject = finalData?.map((project) => ({
          id: project._id,
          projectName: project.projectName,
        }));
        setProject(finalProject);
      } catch (error) {
        console.error('Error fetching timesheet data:', error);
      }
    };
    if (user) {
      fetchProjectData();
    }
  }, [token, user])

  React.useEffect(() => {
    const savedInputValues = JSON.parse(localStorage.getItem('inputValues'));
    const savedComments = JSON.parse(localStorage.getItem('comments'));

    if (savedInputValues) {
      setInputValues(savedInputValues);
    }
    if (savedComments) {
      setComments(savedComments);
    }
  }, []);

 
  React.useEffect(() => {
    localStorage.setItem('inputValues', JSON.stringify(inputValues));
    localStorage.setItem('comments', JSON.stringify(comments));
  }, [inputValues, comments]);

  const handleCommentChange = (value, index) => {
    const newComments = [...comments];
    newComments[index] = value;
    setComments(newComments);
  };

  const handleCommentClick = (index) => {
    setVisibleCommentIndex(index === visibleCommentIndex ? -1 : index);
  };

  const handleWeekChange = (direction) => {
    const newWeek = new Date(currentWeek);
    if (direction === 'next') {
      newWeek.setDate(newWeek.getDate() + 7);
    } else if (direction === 'previous') {
      newWeek.setDate(newWeek.getDate() - 7);
    }
    setCurrentWeek(newWeek);
  };

  React.useEffect(() => {
    const updatedStartingSundayDate = new Date(currentWeek);
    updatedStartingSundayDate.setDate(updatedStartingSundayDate.getDate() - updatedStartingSundayDate.getDay());
    setStartingSundayDates(updatedStartingSundayDate);
    setInputValues(Array(7).fill(''));
    setComments(Array(7).fill(''));
    setVisibleCommentIndex(-1);
  }, [currentWeek]);

  const renderInputFields = () => {
    const inputFields = [];
    const options = { month: '2-digit', day: '2-digit' };

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startingSundayDates);
      currentDate.setDate(currentDate.getDate() + i);
      const weekday = currentDate.toLocaleDateString('en-US', { weekday: 'short' });
      const dayMonth = currentDate.toLocaleDateString('en-US', options);
      const dateString = `${weekday} ${dayMonth}`;

      const textField = (
        <div key={i} style={{ alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ marginLeft: '30px', top: '50px' }}>
            <span style={{ fontSize: '10px', position: 'absolute', color: 'black' }}>{dateString}</span>
            <TextField
              style={{ margin: '10px 10px 10px 0', width: '60px', marginTop: '30px' }}
              label={dateString}
              type="number"
              value={inputValues[i]}
              onChange={(e) => handleValueChange(e.target.value, i)}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                style: { fontSize: '12px', padding: '6px 10px' },
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <IconButton onClick={() => handleCommentClick(i)}>
              <AlignHorizontalLeftIcon style={{ fontSize: 'small', marginLeft: '00px', bottom: '10px', left: '30px', position: 'absolute' }} />
            </IconButton>
          </div>

          <input
            id={`comment-${i}`}
            style={{
              display: visibleCommentIndex === i ? 'block' : 'none',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '16px',
              position: 'absolute'
            }}
            placeholder={`Enter comment for ${dateString}`}
            value={comments[i]}
            onChange={(e) => handleCommentChange(e.target.value, i)}
            className="comment-input"
          />
        </div>
      );

      inputFields.push(textField);
    }

    return inputFields;
  };
  const handleValueChange = (value, index) => {
    const newInputValues = [...inputValues];
    newInputValues[index] = value;
    setInputValues(newInputValues);

    setSelectedInput(prevSelectedInput => {
      const newSelectedInput = [...prevSelectedInput];
      newSelectedInput[index] = value; // Store any additional data if needed
      return newSelectedInput;
    });
  };

  //-----------------Handle Submit ---------------------

  const handleAddButtonClick = async () => {
    const userId = user._id;
    const startingSundayDate = new Date(currentWeek);
    startingSundayDate.setDate(startingSundayDate.getDate() - startingSundayDate.getDay());

    const timesheetEntries = [];
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startingSundayDate);
      currentDate.setDate(currentDate.getDate() + i);
      const entry = {
        date: currentDate.toISOString(),
        value: inputValues[i],
        comment: comments[i],
        project: selectedProject,
        task: selectedTask,
        shortdesc: 'Check',
      };
      timesheetEntries.push(entry);
    }
    const requestBody = {
      userId: userId,
      timesheetEntries: timesheetEntries,
      selectedProject: selectedProject,
      selectedTask: selectedTask
    };

    try {
      const response = await fetch(`${BASE_URL}/user/createTimesheet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      const result = await response.json();
      alert('Timesheets submitted successfully!');
      setInputValues(Array(7).fill(''));
      setComments(Array(7).fill(''));
      setSelectedProject('');
      setSelectedTask('');
      window.location.reload(); // 
    } catch (error) {
      console.error('Error during API call:', error);
      alert('Failed to submit timesheets. Please try again later.');
    }
  };


  return (

    <>
      <AppBar position="static" sx={{ background: '#F6FCFC', height: '140px', marginBottom: '0px' }}>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 0.9, color: 'grey', marginLeft: '0px' }}>
            <div style={{ display: 'flex', flexDirection: 'row', marginTop: '20px', }}>

              <div style={{ display: 'flex', flexDirection: 'row', marginTop: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ marginLeft: '40px', fontSize: '15px', color: 'black' }}>  Project</span>
                  <Select
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    displayEmpty
                    sx={{ marginLeft: '30px', height: '33px', width: '120px', border: 'none', marginTop: '5px' }}
                  >
                    <MenuItem value="" disabled>
                      Project
                    </MenuItem>
                    {project?.map((option, index) => (
                      <MenuItem key={index} value={option.projectName} onClick={() => handleMenuItemClick(option, 'projectName')}>
                        {option.projectName}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ marginLeft: '40px', fontSize: '15px', top: '20px', color: 'black' }}> Task</span>
                  <Select
                    value={selectedTask}
                    onChange={(e) => setSelectedTask(e.target.value)}
                    displayEmpty
                    sx={{ marginLeft: '30px', height: '33px', width: '100px', marginTop: '5px' }}
                  >
                    <MenuItem value="" disabled>
                      Task
                    </MenuItem>
                    {tasks.map((task, index) => (
                      <MenuItem key={index} value={task.taskName} onClick={() => handleMenuItemClick(task, 'task')}>
                        {task.taskName}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
                {renderInputFields()}
              </div>
            </div>
          </Typography>

          <IconButton style={{ marginLeft: '0px' }} size="small" onClick={() => handleWeekChange('previous')} color="black">
            <ArrowBackIcon />
          </IconButton>
          <IconButton size="small" onClick={() => handleWeekChange('next')} color="black" style={{ marginRight: '0px' }}>
            <ArrowForwardIcon />
          </IconButton>
          <Button onClick={handleAddButtonClick} style={{
            backgroundColor: '#1976D2',
            color: 'white',
            padding: '2px',
            margin: '28px',
            marginTop: '40px',
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

export default React.memo(AppbarComponent);
