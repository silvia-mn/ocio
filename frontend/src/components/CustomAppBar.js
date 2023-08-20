import React,{useEffect,useState,useContext} from 'react';
import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import ButtonGroup from '@mui/material/ButtonGroup';
import { Link } from 'react-router-dom';
import Logo from './Logo'
import  Menu  from './Menu';
import { AuthContext } from '../auth/AuthProvider';

function BasicButtonGroup() {
  return (
    <ButtonGroup variant="contained" aria-label="outlined primary button group">
      <Button component={Link} to="/login">LOGIN</Button>
      <Button component={Link} to="/register">SIGN UP</Button>
    </ButtonGroup>
  );
}

const StyledAppBar = styled(AppBar)(({theme}) => ({
  backgroundColor:theme.palette.primary.main_translucent,
}));

export default function CustomAppBar() {
  const {loaded,UPData,role} = useContext(AuthContext);
  const [name,setName]= useState('');
  const [surname,setSurname]= useState('');

  useEffect(()=>{
    if(loaded){
      if(role==='admin'){
        setName('A');
        setSurname('D');
      }else if(role==='promoter'){
        setName(UPData.name);
        setSurname(UPData.name);
      }else if(role==='user'){
        setName(UPData.name);
        setSurname(UPData.surname1);
      }
    }
  },[loaded,UPData,role])

  return (
    <Box sx={{flexGrow: 1}}>
      <StyledAppBar>
        <Toolbar>
          <Box sx={{flexGrow:1,flex:1, display:{xs:'none',sm:'block'}}} >
          <Link
            to="/home"
            style={{ textDecoration: 'none' }}
            color="inherit">
          <Logo/>
          </Link>
          </Box>
          {loaded && (role!=='unlogged' ? <Typography variant='h4'> <Menu name={name} surname={surname} /></Typography> :
          <BasicButtonGroup>LOG IN</BasicButtonGroup>)}
        </Toolbar>
      </StyledAppBar>
    </Box>
  );
}