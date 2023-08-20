import { styled,alpha } from '@mui/material/styles';
import React, {useContext} from 'react';
import { Typography,Paper,  Button } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';

import SearchBar from './SearchBar';

import header_img from '../assets/big_header2.jpeg';
import { AuthContext } from '../auth/AuthProvider';
import { Link } from 'react-router-dom';

const BannerContainer = styled('div')(({ theme }) => ({
    display:"flex",
    justifyContent: "center",
    alignCenter : "center",
    padding: theme.spacing(16,0,0,0),
    position:"relative",
    minWidth:"100%",
    minHeight:theme.spacing(64),
    maxHeight:theme.spacing(64),
    backgroundImage:`url(${header_img})`,
    backgroundPosition: "50% 50%",
    maskImage:"linear-gradient(rgba(0,0,0,1) 50%, rgba(0,0,0,0.95) 60%, rgba(0,0,0,0.80) 70%, rgba(0,0,0,0.60) 80%, rgba(0,0,0,0.45) 90%, rgba(0,0,0,0))",
  }));

const SearchContainer = styled('div')(({ theme }) => ({
    height: "fit-content",
    textAlign: "center",
    justifyContent: "center",
    alignCenter : "center",
}));

const StyledPaper = styled(Paper)(({theme}) =>({
  margin: theme.spacing(2),
  backgroundColor:alpha(theme.palette.secondary.main,0.7),
  padding:theme.spacing(1),
  fontFamily: 'Arial, sans-serif',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

const StyledButton = styled(Button)(({theme}) =>({
  margin: theme.spacing(15),
  backgroundColor:alpha(theme.palette.secondary.main,0.7),
  padding:theme.spacing(2),
  ":hover":{
    backgroundColor:theme.palette.secondary.main,
  }
}));



function Banner({setSearchQuery}) {
  
  const {loaded,role,UPData} = useContext(AuthContext);

  return (
    <BannerContainer>
        <SearchContainer class="A">
          {loaded &&( role==='promoter' ? (
            UPData.validated ? (
              <>
            <StyledPaper elevation={12} variant='outlined'>
              <Typography variant='h1'>YOUR ACTIVE EVENTS.</Typography>
              <Typography variant='h3'>Click on an event to see its details, modify or delete it.</Typography>
            </StyledPaper>
            <StyledButton component={Link} to="/add"><AddCircleIcon fontSize="large" sx={{transform:"translate(-10%,5%)"}}/><Typography variant='h2' justifyContent="center">ADD EVENT</Typography></StyledButton>
            </>
            ) : (
            <StyledPaper elevation={12} variant='outlined'>
              <Typography variant='h1'>WAITING TO BE VALIDATED.</Typography>
              <Typography variant='h3'>Please be patient while our admin reviews your request.</Typography>
            </StyledPaper>
            )
          ) : 
          (
            <div>
              <Typography class="b" variant='h1'>ENJOY.</Typography>
              <SearchBar setSearchQuery={setSearchQuery} minWidth="800"/>
            </div>
          ))}
          
        </SearchContainer>
    </BannerContainer>
  );
}

export default Banner;

  
  
