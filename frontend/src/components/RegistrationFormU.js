import * as React from 'react';
import { Box, TextField, Button,Alert, FormControl, InputAdornment } from '@mui/material';
import axios from 'axios';

import {useNavigate} from 'react-router-dom'

export default function RegistrationFormU(props) {
  const [name, setName] = React.useState('');
  const [ surname1,  setSurname1] = React.useState('');
  const [surname2, setSurname2] = React.useState('');
  const [dni, setDni] = React.useState('');
  const [dob, setDob] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [login, setLogin] = React.useState('');
  const [password, setPassword] = React.useState('');
  const maxDate = new Date().toISOString().split("T")[0];

  const [errorMessage, setErrorMessage] = React.useState('');
  const [error, setError] = React.useState(false);

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const user = {
      name,
      surname1,
      surname2,
      email,
      dni,
      dob,
      phone,
    };
    const data = { login:{login,password}, user };
    axios
      .post(process.env.REACT_APP_API+'/register/user', data)
      .then((response) => {
        console.log(response.data);
        navigate('/home');
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
    <Box sx={{ display: 'flex', alignItems: 'center', flexDirection:'column',justifyContent: 'center', minHeight: '100vh' }}>
       {
          error &&
            <Alert severity="error" onClose={onClose}>{errorMessage}</Alert>
        }
    <Box sx={{ width: '400px', p: 2 }}>
      <form onSubmit={handleSubmit}>
        <FormControl variant="outlined" required fullWidth sx={{ mb: 2, width: '100%'}}>
          <TextField
            required
            label="First Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            sx={{ width: '100%' }}
          />
        </FormControl>
        <FormControl variant="outlined" required fullWidth sx={{ mb: 2, width: '100%' }}>
          <TextField
            required
            label="Last Name"
            value={ surname1}
            onChange={(event) =>  setSurname1(event.target.value)}
            sx={{ width: '100%' }}
          />
          </FormControl>
          <FormControl variant="outlined" required fullWidth sx={{ mb: 2, width: '100%' }}>
            <TextField
              label="Last Name 2"
              value={surname2}
              onChange={(event) => setSurname2(event.target.value)}
              sx={{ width: '100%' }}
            />
          </FormControl>
          <FormControl variant="outlined" required fullWidth sx={{ mb: 2, width: '100%' }}>
            <TextField
              label="DNI"
              required
              value={dni}
              onChange={(event) => setDni(event.target.value)}
              sx={{ width: '100%' }}
            />
          </FormControl>
          <FormControl variant="outlined" required fullWidth sx={{ mb: 2, width: '100%' }}>
            <TextField
              id="dob"
              label="Date of Birth"
              type="date"
              required
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                inputProps: {
                  max: maxDate,
                },
                placeholder: "",
              }}
              fullWidth
              onChange={(event) => setDob(event.target.value)}
              sx={{ mb: 2 }}
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
            label="Login"
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
