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

export default function ModifyFormP() {
  const [name, setName] = React.useState('...');
  const [nameChange, setNameChange] = React.useState(false);

  const [socialCapital, setsocialCapital] = React.useState('...');
  const [socialCapitalChange, setsocialCapitalChange] = React.useState(false);
  
  const [personInCharge,  setpersonInCharge] = React.useState('...');
  const [personInChargeChange, setpersonInChargeChange] = React.useState(false);
  
  const [registeredOffice, setregisteredOffice] = React.useState('...');
  const [registeredOfficeChange, setregisteredOfficeChange] = React.useState(false);

  const [cif, setCif] = React.useState('...');
  const [validated, setValidated] = React.useState('...');

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
        setCif(UPData.cif);
        setValidated(`${UPData.validated}`);
        setName(UPData.name);
        setPhone(UPData.phone);
        setEmail(UPData.email);
        setpersonInCharge(UPData.personInCharge);
        setregisteredOffice(UPData.registeredOffice);
        setsocialCapital(UPData.socialCapital);
        setLocalLoaded(true);
    }
  },[loaded,localLoaded,UPData]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!nameChange&&!personInChargeChange&&!registeredOfficeChange&&!phoneChange&&!socialCapital){
      setErrorMessage("No fields modified");
      setError(true);
      setSuccess(false);
    }else{
      const promoter = {};
      if(nameChange) promoter.name=name;
      if(personInChargeChange) promoter.personInCharge=personInCharge;
      if(registeredOfficeChange) promoter.registeredOffice=registeredOffice;
      if(socialCapitalChange) promoter.socialCapital=socialCapital;
      if(phoneChange) promoter.phone=phone;

      axios({
        url: process.env.REACT_APP_API+'/promoter/account',
        method: 'POST',
        withCredentials: true,
        data : {promoter:promoter}
        })
        .then((response) => {
          setSuccessMessage('Modified correctly');
          setSuccess(true);
          setNameChange(false);
          setpersonInChargeChange(false);
          setregisteredOfficeChange(false);
          setsocialCapitalChange(false);
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
            label="Name"
            value={name}
            onChange={(event) => {setName(event.target.value);setNameChange(true);}}
            sx={{ width: '100%' }}
          />
        </FormControl>
        <FormControl variant="outlined" required fullWidth sx={{ mb: 2, width: '100%' }}>
          <TextField
            required
            label="Person in charge"
            value={ personInCharge}
            onChange={(event) =>  {setpersonInCharge(event.target.value);setpersonInChargeChange(true);}}
            sx={{ width: '100%' }}
          />
          </FormControl>
          <FormControl variant="outlined" required fullWidth sx={{ mb: 2, width: '100%' }}>
            <TextField
              label="Registered office"
              required
              value={registeredOffice}
              onChange={(event) => {setregisteredOffice(event.target.value);setregisteredOfficeChange(true);}}
              sx={{ width: '100%' }}
            />
          </FormControl>
          <FormControl variant="outlined" required fullWidth sx={{ mb: 2, width: '100%' }}>
            <TextField
              label="Social Capital"
              required
              value={socialCapital}
              onChange={(event) => {setsocialCapital(event.target.value);setsocialCapitalChange(true);}}
              sx={{ width: '100%' }}
            />
          </FormControl>
          <FixedData label="CIF" value={cif}/>
          <FixedData label="validated" value={validated}/>
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
