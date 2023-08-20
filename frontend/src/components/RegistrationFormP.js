import * as React from 'react';
import { Box, TextField, Button, FormControl, Alert, InputAdornment } from '@mui/material';
import axios from 'axios';

import {useNavigate} from 'react-router-dom'

export default function RegistrationFormP() {
  const [name, setName] = React.useState('');
  const [personInCharge, setPersonInCharge] = React.useState('');
  const [registeredOffice, setRegisteredOffice] = React.useState('');
  const [cif, setCif] = React.useState('');
  const [socialCapital, setSocialCapital] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [login, setLogin] = React.useState('');
  const [password, setPassword] = React.useState('');

  const [errorMessage, setErrorMessage] = React.useState('');
  const [error, setError] = React.useState(false);

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const promoter = {
      name,
      personInCharge,
      registeredOffice,
      email,
      cif,
      socialCapital,
      phone,
    };
    const data = { login:{login,password}, promoter };
    axios
      .post(process.env.REACT_APP_API+'/register/promoter', data)
      .then((response) => {
        navigate('/home')
      })
      .catch((error) => {
        if(error?.response?.data?.error)
          setErrorMessage(error.response.data.error);
        else
          setErrorMessage("An error has occurred");
        setError(true);
      });
};

const onClose = ()=>{
  setError(false);
}

  return (
    <Box sx={{ display: 'flex', flexDirection:"column", alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      {
        error &&
          <Alert severity="error" onClose={onClose}>{errorMessage}</Alert>
      }
    <Box sx={{ width: '400px', p: 2 }}>
      <form onSubmit={handleSubmit}>
        <FormControl variant="outlined" required fullWidth sx={{ mb: 2, width: '100%'}}>
          <TextField
            required
            label="Company Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            sx={{ width: '100%' }}
          />
        </FormControl>
        <FormControl variant="outlined" required fullWidth sx={{ mb: 2, width: '100%' }}>
          <TextField
            required
            label="person In Charge"
            value={personInCharge}
            onChange={(event) => setPersonInCharge(event.target.value)}
            sx={{ width: '100%' }}
          />
          </FormControl>
          <FormControl variant="outlined" required fullWidth sx={{ mb: 2, width: '100%' }}>
            <TextField
              label="registered Office"
              required
              value={registeredOffice}
              onChange={(event) => setRegisteredOffice(event.target.value)}
              sx={{ width: '100%' }}
            />
          </FormControl>
          <FormControl variant="outlined" required fullWidth sx={{ mb: 2, width: '100%' }}>
            <TextField
              label="CIF"
              required
              value={cif}
              onChange={(event) => setCif(event.target.value)}
              sx={{ width: '100%' }}
            />
          </FormControl>
          <FormControl variant="outlined" required fullWidth sx={{ mb: 2, width: '100%' }}>
            <TextField
              label="social Capital"
              required
              value={socialCapital}
              onChange={(event) => setSocialCapital(event.target.value)}
              sx={{ width: '100%' }}
            />
          </FormControl>
          <FormControl variant="outlined" required fullWidth sx={{ mb: 2, width: '100%' }}>
            <TextField
              label="Phone"
              required
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              sx={{ width: '100%' }}
            />
          </FormControl>
        <FormControl variant="outlined" required fullWidth sx={{ mb: 2, width: '100%' }}>
          <TextField
            required
            label="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="begin" x={{ marginLeft: 'auto', marginRight: 'auto' }}>
                    ex@mple.com
                  </InputAdornment>
              ),
            }}
            sx={{ width: '100%' }}
          />
        </FormControl>
        <FormControl variant="outlined" required fullWidth sx={{ mb: 2, width: '100%' }}>
          <TextField
            required
            label="Username"
            type="login"
            value={login}
            onChange={(event) => setLogin(event.target.value)}
            sx={{ width: '100%' }}
          />
        </FormControl>
        <FormControl variant="outlined" required fullWidth sx={{ mb: 2, width: '100%' }}>
          <TextField
            required
            label="Password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            sx={{ width: '100%' }}
          />
        </FormControl>
        
        <FormControl fullWidth sx={{ mb: 2 }}>
            <Button variant="contained" type="submit" sx={{ width: '100%', mt: 2 }}>Register </Button>
      </FormControl>
      </form>
    </Box>
  </Box>
);
};
