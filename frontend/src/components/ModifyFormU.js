import * as React from 'react';
import { Box, Typography, TextField, Button,Alert, FormControl } from '@mui/material';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import {CircularProgress} from '@mui/material';
import { AuthContext } from '../auth/AuthProvider';

const LoadingIcon = styled(CircularProgress)(({theme})=> ({
  color: theme.palette.secondary.main,
}));

function FixedData({label, value}){
  return(
  <Box sx={{marginLeft:2,marginBottom:3}}>
    <Typography variant="body2">
      {label}
    </Typography>
    <Typography variant="body1">
      {value}
    </Typography>
  </Box>);
}

export default function ModifyFormU() {
  const [name, setName] = React.useState('...');
  const [nameChange, setNameChange] = React.useState(false);
  
  const [surname1,  setSurname1] = React.useState('...');
  const [surname1Change, setSurname1Change] = React.useState(false);
  
  const [surname2, setSurname2] = React.useState('...');
  const [surname2Change, setSurname2Change] = React.useState(false);

  const [dni, setDni] = React.useState('...');
  const [dob, setDob] = React.useState('...');

  const [phone, setPhone] = React.useState('...');
  const [phoneChange, setPhoneChange] = React.useState(false);

  const [email, setEmail] = React.useState('...');

  const [errorMessage, setErrorMessage] = React.useState('');
  const [error, setError] = React.useState(false);

  const [successMessage, setSuccessMessage] = React.useState('');
  const [success, setSuccess] = React.useState(false);

  const {loaded,UPData} = React.useContext(AuthContext);
  const [localLoaded,setLocalLoaded]=React.useState(false)

  React.useEffect(()=>{
    if (loaded){
        setDni(UPData.dni);
        const dob = new Date(UPData.dob);
        setDob(`${dob.getFullYear()}-${("0"+(dob.getMonth()+1)).slice(-2)}-${dob.getDate()}`);
        setName(UPData.name);
        setPhone(UPData.phone);
        setEmail(UPData.email);
        setSurname1(UPData.surname1);
        setSurname2(UPData.surname2);
        setLocalLoaded(true);
    }
  },[loaded,localLoaded,UPData]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!nameChange&&!surname1Change&&!surname2Change&&!phoneChange){
      setErrorMessage("No fields modified");
      setError(true);
      setSuccess(false);
    }else{
      const user = {};
      if(nameChange) user.name=name;
      if(surname1Change) user.surname1=surname1;
      if(surname2Change) user.surname2=surname2;
      if(phoneChange) user.phone=phone;

      axios({
        url: process.env.REACT_APP_API+'/user/account',
        method: 'POST',
        withCredentials: true,
        data : {user:user}
        })
        .then((response) => {
          setSuccessMessage('Modified correctly');
          setSuccess(true);
          setNameChange(false);
          setSurname1Change(false);
          setSurname2Change(false);
          setPhoneChange(false);
          setError(false);
        })
        .catch((error) => {
          setSuccess(false);
          if(error?.response?.data?.error)
            setErrorMessage(error.response.data.error);
          else
            setErrorMessage("An error has occurred");
        setError(true);
      });
    }
};

const onClose = ()=>{
  setError(false);
}

const onCloseSuccess = () =>{
  setSuccess(false);
}

  return (
    !localLoaded ? <LoadingIcon/> :
    <Box sx={{ display: 'flex', alignItems: 'center', flexDirection:'column',justifyContent: 'center', minHeight: '100vh' }}>
       {
          error &&
            <Alert severity="error" onClose={onClose}>{errorMessage}</Alert>
        }
        {
          success &&
            <Alert severity="success" onClose={onCloseSuccess}>{successMessage}</Alert>
        }
    <Box sx={{ width: '400px', p: 2 }}>
      <form onSubmit={handleSubmit}>
        <FormControl variant="outlined" required fullWidth sx={{ mb: 2, width: '100%'}}>
          <TextField
            required
            label="First Name"
            value={name}
            onChange={(event) => {setName(event.target.value);setNameChange(true);}}
            sx={{ width: '100%' }}
          />
        </FormControl>
        <FormControl variant="outlined" required fullWidth sx={{ mb: 2, width: '100%' }}>
          <TextField
            required
            label="Last Name"
            value={ surname1}
            onChange={(event) =>  {setSurname1(event.target.value);setSurname1Change(true);}}
            sx={{ width: '100%' }}
          />
          </FormControl>
          <FormControl variant="outlined" required fullWidth sx={{ mb: 2, width: '100%' }}>
            <TextField
              label="Last Name 2"
              value={surname2}
              onChange={(event) => {setSurname2(event.target.value);setSurname2Change(true);}}
              sx={{ width: '100%' }}
            />
          </FormControl>
          <FixedData label="DNI" value={dni}/>
          <FixedData label="Date of Birth" value={dob}/>
          <FormControl variant="outlined" required fullWidth sx={{ mb: 2, width: '100%' }}>
            <TextField
              label="Phone"
              required
              value={phone}
              onChange={(event) => {setPhone(event.target.value);setPhoneChange(true);}}
              sx={{ width: '100%' }}
            />
          </FormControl>
        <FixedData label="Email" value={email}/>
        
        <FormControl fullWidth sx={{ mb: 2 }}>
            <Button variant="contained" type="submit" sx={{ width: '100%', mt: 2 }}>Modify </Button>
      </FormControl>
      </form>
    </Box>
  </Box>
);
};
