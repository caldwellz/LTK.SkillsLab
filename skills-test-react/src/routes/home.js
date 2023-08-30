import * as React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export default function Home() {
  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        React Skills Test
      </Typography>
    </Box>
  );
}
