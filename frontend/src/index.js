import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter as Router,Route,Routes} from 'react-router-dom';
import './index.css';
import App from './pages/App';
import reportWebVitals from './reportWebVitals';

import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';

import RegistrationPage from './pages/Register';
import Login from './pages/Login';
import EventPage from './pages/Event'
import  ValidatePage  from './pages/Validate';

import { AuthProvider } from './auth/AuthProvider';
import Safeguard  from './auth/Safeguard'

import ModifyPageU from './pages/ModifyU';
import ModifyPageP from './pages/ModifyP';
import ModifyPageE from './pages/ModifyEvent';
import RegisterEvent from './pages/RegisterEvent';
import History from './pages/History';
import {Navigate} from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to= '/home'></Navigate>}/>
          <Route path="/modifyU" element={<Safeguard reqRole='user'><ModifyPageU/></Safeguard>}/>
          <Route path="/modifyP" element={<Safeguard reqRole='promoter'><ModifyPageP/></Safeguard>}/>
          <Route path="/home" element={<App/>}/>
          <Route path="/register" element={<Safeguard reqRole='unlogged' message='Cannot register if logged'><RegistrationPage/></Safeguard>}/>
          <Route path="/login" element={<Safeguard reqRole='unlogged' message='Already logged in!'><Login/></Safeguard>}/>
          <Route path= "/event/:id" element={<EventPage/>}/>
          <Route path="/validate" element={<Safeguard reqRole='admin' message='Administration only page!'><ValidatePage/></Safeguard>}/>
          <Route path="/purge" element={<Safeguard reqRole='admin' message='Administration only page!'><ValidatePage mode='delete'/></Safeguard>}/>
          <Route path="/add" element={<Safeguard reqRole='validatedPromoter' message="Must be a validated promoter"><RegisterEvent/></Safeguard>}/>
          <Route path="/modify/:id" element={<ModifyPageE/>}/>
          <Route path="/history" element={<History/>}/>
        </Routes>
      </Router>
    </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
