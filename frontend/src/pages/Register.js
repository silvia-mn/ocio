import * as React from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import RFormU from '../components/RegistrationFormU';
import RFormP from '../components/RegistrationFormP';
import Footer from "../components/Footer";
import CustomAppBar from "../components/CustomAppBar";

import bg_image from "../assets/bg.jpeg";

const Bg = styled('div')(({ theme }) => ({
    backgroundImage : `url(${bg_image})`,
    backgroundPosition: "50% 20%",
    minHeight: '100vh',
    minWidth:'100vw',
    backgroundSize: 'cover'
  }));
  
  
  const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Bg>
      <CustomAppBar/>
      <Offset/>
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="REGISTER AS USER" {...a11yProps(0)} />
          <Tab label="REGISTER AS PROMOTER" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>     
        <RFormU/>
        <Footer/> 
      </TabPanel>
      <TabPanel value={value} index={1}>
        <RFormP/>
        <Footer/> 
      </TabPanel>
    </Box>
    </Bg>
  );
}