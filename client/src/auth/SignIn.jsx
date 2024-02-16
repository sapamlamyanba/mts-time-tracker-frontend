import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom'
import { Modal } from '@mui/material';


function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright ©MTS '}
      <Link color="inherit" href="https://mui.com/">
        Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}


const defaultTheme = createTheme();




export default function SignIn() {

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  // const [email1, setEmail1] = React.useState('')




  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');
    try {
      const myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');

      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify({
          email: email,
          password: password,
        }),
        redirect: 'follow',
      };
      fetch("http://localhost:8000/api/user/signIn", requestOptions)
        .then(response => response.json())
        .then(result => {
          console.log(result)
          if (result.success) {
            localStorage.setItem('token', result.token);
            navigate('/dashboard')
          } else {
            alert('Error in sign in')
          }
        })
        .catch(error => console.log('error', error));
    } catch (error) {

      console.error('Error during login:', error);

      setError('An error occurred. Please try again later.');
    }
  };

  const handleEmailSubmit = async (event) => {
    event.preventDefault();
   
      const myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');

      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify({
          email: email
        })
      }
      fetch('http://localhost:8000/api/password-reset', requestOptions)
        .then((response) => response.json())
        
        .then((result) => {if (result) {
          alert('Successfull')
          navigate('/forgotResetPassword')
          localStorage.setItem('resetToken', result.resetToken);
          
        } else {
          
        }})
        .catch((error) => console.error(error));
    
  }


  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event) => {
    setEmail(event.target.value);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}

            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && (
              <Typography variant="body2" color="error" align="center" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Button onClick={handleOpen}>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Button>
                <Modal open={open} onClose={handleClose}>
                  <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4, width: 400 }}>
                    <h2>Forgot Password</h2>

                    <TextField name="email" label="Email" variant="outlined" value={email} onChange={handleChange} fullWidth margin="normal" />


                    <Button onClick={handleEmailSubmit} variant="contained" color="primary" fullWidth>
                      Submit
                    </Button>
                  </Box>
                </Modal>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}