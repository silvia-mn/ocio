import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#111144',
      main_translucent: "rgba(11,11,44,0.5)",
      light: '#771177',
      dark: '#111111',
      contrastText: '#fff',
    },
    secondary: {
      main: '#9c069e',
      light: '#ffb266',
      dark: '#cc4d00',
      contrastText: '#000',
    },
    background: {
      default: '#fff',
      paper: '#f5f5f5',
    },
    text: {
      primary: '#000',
      secondary: '#000',
    },
  },
  typography: {
    fontFamily: 'Righteous',
    ultra: {
      fontWeight: 600,
      fontSize: '5rem',
      lineHeight: 1.6,
      letterSpacing: '-0.01562em',
    },
    h1: {
      fontWeight: 500,
      fontSize: '3rem',
      lineHeight: 1.2,
      letterSpacing: '-0.01562em',
    },
    h2: {
      fontWeight: 500,
      fontSize: '2.5rem',
      lineHeight: 1.2,
      letterSpacing: '-0.00833em',
    },
    h3: {
      fontWeight: 500,
      fontSize: '2rem',
      lineHeight: 1.2,
      letterSpacing: '0em',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
      letterSpacing: '0.00938em',
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  shape:{
    borderRadius : 16,
  },
  spacing: 8,
});

export default theme;
