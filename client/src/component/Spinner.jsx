import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

function Spinner() {
  return (
    <Box sx={{ display: 'flex', alignItems:'center',justifyContent:'center',
    marginTop: '150px' }}>
      <CircularProgress />
    </Box>
  )
}

export default Spinner