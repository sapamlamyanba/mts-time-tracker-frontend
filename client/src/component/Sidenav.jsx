import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '../appStore';
import { useSelector } from 'react-redux';


const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));



const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

export default function Sidenav() {
  const theme = useTheme();
  const { user } = useSelector(state => state.user)
  const updateOpen = useAppStore((state) => state.updateOpen)
  const open = useAppStore((state) => state.dopen);
  const navigate = useNavigate()
  const location = useLocation();

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Box height={30} />
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        {user?.isAdmin ?
          (<>
            <List>
              <ListItem disablePadding sx={{ display: 'block' }}>
              <NavLink
                  to="/dashboard"
                  style={{ textDecoration: 'none' }}
                  activestyle={{ backgroundColor: theme.palette.action.selected }}
                >
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                    },
                    backgroundColor: location.pathname === '/dashboard' ? theme.palette.action.selected : 'transparent',
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    <InboxIcon />
                  </ListItemIcon>
                  <ListItemText primary='Timesheet' sx={{ opacity: open ? 1 : 0,color:'black' }} />
                </ListItemButton>
                </NavLink>
              </ListItem>
              <ListItem disablePadding sx={{ display: 'block' }} onClick={() => navigate('/reports')}>
              <NavLink   to="/reports"
                  style={{ textDecoration: 'none'}}>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                    },
                    backgroundColor: location.pathname === '/reports' ? theme.palette.action.selected : 'transparent',
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    <InboxIcon />
                  </ListItemIcon>
                  <ListItemText primary='Reports' sx={{ opacity: open ? 1 : 0,color:'black' }} />
                </ListItemButton>
                </NavLink>
              </ListItem>
              <ListItem disablePadding sx={{ display: 'block' }} onClick={() => navigate('/users')}>
                <NavLink   to="/users"
                  style={{ textDecoration: 'none'}}>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                    },
                    backgroundColor: location.pathname === '/users' ? theme.palette.action.selected : 'transparent',
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    <InboxIcon />
                  </ListItemIcon>
                  <ListItemText primary='Users' sx={{ opacity: open ? 1 : 0,color:'black' }} />
                </ListItemButton>
                </NavLink>
              </ListItem>
              <ListItem disablePadding sx={{ display: 'block' }} >
              <NavLink
                  to="/project"
                  style={{ textDecoration: 'none'}}
                
                >
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                    },
                    backgroundColor: location.pathname === '/project' ? theme.palette.action.selected : 'transparent',
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    <InboxIcon />
                  </ListItemIcon>
                  <ListItemText primary='Project' sx={{ opacity: open ? 1 : 0,color:'black' }} />
                </ListItemButton>
                </NavLink>
              </ListItem>
              <ListItem disablePadding sx={{ display: 'block' }} >
              <NavLink
                  to="/account"
                  style={{ textDecoration: 'none'}}
                  // activeStyle={{ backgroundColor: theme.palette.action.selected }}
                >
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                    },
                    backgroundColor: location.pathname === '/account' ? theme.palette.action.selected : 'transparent',
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    <InboxIcon />
                  </ListItemIcon>
                  <ListItemText primary='Account' sx={{ opacity: open ? 1 : 0,color:'black' }} />
                </ListItemButton>
                </NavLink>
              </ListItem>
            </List>
          </>) : user?.isManager ? (
            <>
             <List>
                <ListItem disablePadding sx={{ display: 'block' }} >
                <NavLink
                  to="/dashboard"
                  style={{ textDecoration: 'none'}}
                  // activeStyle={{ backgroundColor: theme.palette.action.selected }}
                >
                  <ListItemButton
                   component="div"
                   sx={{
                     minHeight: 48,
                     justifyContent: open ? 'initial' : 'center',
                     px: 2.5,
                     '&:hover': {
                       backgroundColor: theme.palette.action.hover,
                     },
                     backgroundColor: location.pathname === '/dashboard' ? theme.palette.action.selected : 'transparent',
                   }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                      }}
                    >
                      <InboxIcon />
                    </ListItemIcon>
                    <ListItemText primary='Timesheet' sx={{ opacity: open ? 1 : 0,color: 'black' }} />
                  </ListItemButton>
                  </NavLink>
                </ListItem>
                <ListItem disablePadding sx={{ display: 'block' }} >
                <NavLink
                  to="/reports"
                  style={{ textDecoration: 'none'}}>
                  <ListItemButton
                   component="div"
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? 'initial' : 'center',
                      px: 2.5,
                      '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                      },
                      backgroundColor: location.pathname === '/reports' ? theme.palette.action.selected : 'transparent',
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                      }}
                    >
                      <InboxIcon />
                    </ListItemIcon>
                    <ListItemText primary='Reports' sx={{ opacity: open ? 1 : 0,color:'black' }} />
                  </ListItemButton>
                  </NavLink>
                </ListItem>
                <ListItem disablePadding sx={{ display: 'block' }} >
              <NavLink
                  to="/project"
                  style={{ textDecoration: 'none'}}
                  // activeStyle={{ backgroundColor: theme.palette.action.selected }}
                >
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                    },
                    backgroundColor: location.pathname === '/project' ? theme.palette.action.selected : 'transparent',
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    <InboxIcon />
                  </ListItemIcon>
                  <ListItemText primary='Project' sx={{ opacity: open ? 1 : 0,color:'black' }} />
                </ListItemButton>
                </NavLink>
              </ListItem>
                <ListItem disablePadding sx={{ display: 'block' }} onClick={() => navigate('/profile')}>
                  <NavLink   to="/profile"
                  style={{ textDecoration: 'none'}}>
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? 'initial' : 'center',
                      px: 2.5,
                      '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                      },
                      backgroundColor: location.pathname === '/profile' ? theme.palette.action.selected : 'transparent',
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                      }}
                    >
                      <InboxIcon />
                    </ListItemIcon>
                    <ListItemText primary='Profile' sx={{ opacity: open ? 1 : 0,color: 'black' }} />
                  </ListItemButton>
                  </NavLink>
                </ListItem>

              </List>
            </>
          ) : (
            <>
              <List>
                <ListItem disablePadding sx={{ display: 'block' }} >
                <NavLink
                  to="/dashboard"
                  style={{ textDecoration: 'none'}}
                  // activeStyle={{ backgroundColor: theme.palette.action.selected }}
                >
                  <ListItemButton
                   component="div"
                   sx={{
                     minHeight: 48,
                     justifyContent: open ? 'initial' : 'center',
                     px: 2.5,
                     '&:hover': {
                       backgroundColor: theme.palette.action.hover,
                     },
                     backgroundColor: location.pathname === '/dashboard' ? theme.palette.action.selected : 'transparent',
                   }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                      }}
                    >
                      <InboxIcon />
                    </ListItemIcon>
                    <ListItemText primary='Timesheet' sx={{ opacity: open ? 1 : 0,color: 'black' }} />
                  </ListItemButton>
                  </NavLink>
                </ListItem>
                <ListItem disablePadding sx={{ display: 'block' }} >
                <NavLink
                  to="/reports"
                  style={{ textDecoration: 'none'}}>
                  <ListItemButton
                   component="div"
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? 'initial' : 'center',
                      px: 2.5,
                      '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                      },
                      backgroundColor: location.pathname === '/reports' ? theme.palette.action.selected : 'transparent',
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                      }}
                    >
                      <InboxIcon />
                    </ListItemIcon>
                    <ListItemText primary='Reports' sx={{ opacity: open ? 1 : 0,color:'black' }} />
                  </ListItemButton>
                  </NavLink>
                </ListItem>
                <ListItem disablePadding sx={{ display: 'block' }} onClick={() => navigate('/profile')}>
                  <NavLink   to="/profile"
                  style={{ textDecoration: 'none'}}>
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? 'initial' : 'center',
                      px: 2.5,
                      '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                      },
                      backgroundColor: location.pathname === '/profile' ? theme.palette.action.selected : 'transparent',
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                      }}
                    >
                      <InboxIcon />
                    </ListItemIcon>
                    <ListItemText primary='Profile' sx={{ opacity: open ? 1 : 0,color: 'black' }} />
                  </ListItemButton>
                  </NavLink>
                </ListItem>

              </List>
            </>
          )
        }
      </Drawer>
    </Box>
  );
}
