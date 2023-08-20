import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import imChicken from '../assets/chicken.png';
import { Link } from 'react-router-dom';

const AdBox = styled(Box)(({ theme }) => ({
  width:theme.spacing(50),
  height: theme.spacing(30),
  backgroundColor: 'black',
  color: 'white',
  textAlign:'center',
  padding: theme.spacing(2),
  paddingTop: theme.spacing(6),
  
}));

const Ad = () => {
    return (
     <AdBox position="relative">
      <Box>
      <Box component="img" src={imChicken} width={100} sx={{display:'inline'}}/>
      <Box sx={{display:'inline'}}>
        <Typography variant="h5" sx={{fontWeight:'bold'}}>
            🔥Hot Chicks near in your area! 🔥
        </Typography>
        <Typography component={Link} to='https://www.youtube.com/watch?v=gkwsCSJLaeE' variant="body1" sx={{fontWeight:'bold'}}>
            Click here to see
        </Typography>
      </Box>
      </Box>
     </AdBox>
    );
  };
  
  export default Ad;
