import React , {useState,useContext} from 'react';
import { Box,Alert, TextField, Button, FormControl} from '@mui/material';
import {useNavigate} from 'react-router-dom'
import { AuthContext } from '../auth/AuthProvider';

import Logo from './Logo';

export default function RegistrationFormU(props) {

    const {logIn} = useContext(AuthContext);

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [error, setError] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();

        logIn({login:login,password:password},(error,result)=>{
          if(!!error){
            if (error.response && error.response.status===401) {
              setErrorMessage("Incorrect Login");
              setError(true);
            } else {
              setErrorMessage("An error has occurred");
              setError(true);
            }
          }else{
            navigate("/home");
          }
        });
    }

    const onClose = ()=>{
      setError(false);
    }

    return (
      <Box sx={{ display: 'flex', flexDirection:"column", alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <Logo color='black' maxHeight={300}/>
        {
          error &&
            <Alert severity="error" onClose={onClose}>{errorMessage}</Alert>
        }
      <Box sx={{ width: '400px', p: 2 }}>
        <form onSubmit={handleSubmit}>
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
              <Button variant="contained" type="submit" sx={{ width: '100%', mt: 2 }}>Log in </Button>
        </FormControl>
        </form>
      </Box>
    </Box>
  );
  };
  