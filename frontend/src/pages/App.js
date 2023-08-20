
import { styled } from '@mui/material/styles';
import React, { useState, useEffect,useContext } from 'react';
import CustomAppBar from "../components/CustomAppBar";
import Footer from "../components/Footer";
import EventGrid from "../components/EventGrid";
import Header from "../components/Header";

import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import { AuthContext } from '../auth/AuthProvider';
import Ad from '../components/Ad';

import  Cookies  from 'js-cookie';

const Bg = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  minHeight: '100vh',
  minWidth:'100vw',
}));


const Offset = styled('div')(({ theme }) => ({
  minHeight: theme.spacing(4),
}));

export default function LandingPage(){
 const [searchQuery, setSearchQuery] = useState('');
 const [prank,setPrank]=useState(true);
 const {loaded,role,UPData} = useContext(AuthContext);

 useEffect(() => {
  }, [searchQuery]);

  const handleCloseD=()=>{
    setPrank(false);
    Cookies.set('wantsChickens','no');
  }

 return(
   <Bg>
     <CustomAppBar/>
     <Header setSearchQuery={setSearchQuery}/>
     <Offset/>
    {
      Cookies.get('wantsChickens')!=='no' &&
      <Dialog
      open={prank}
      onClose={handleCloseD}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >      
        <Ad position="relative"/>
        <IconButton
        aria-label="close"
        onClick={handleCloseD}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
    </Dialog>
      }
     {/*do not render grid if unvalidated*/
      !(loaded&&role==='promoter'&&!UPData.validated) &&
      <EventGrid searchQuery={searchQuery} />
     }
     <Footer/> 
   </Bg>
  
 )
}