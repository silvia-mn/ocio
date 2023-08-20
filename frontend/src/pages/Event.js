import { styled } from '@mui/material/styles';
import React from 'react';
import CustomAppBar from "../components/CustomAppBar";
import Footer from "../components/Footer";
import EventData from "../components/EventData"

import bg_image from "../assets/bg.jpeg"

const Bg = styled('div')(({ theme }) => ({
  backgroundImage : `url(${bg_image})`,
  backgroundPosition: "50% 20%",
  minHeight: '100vh',
  minWidth:'100vw',
  backgroundSize: 'cover'
}));


const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);

export default function EventPage (){
    return(
        <Bg>
        <CustomAppBar/>
        <Offset/>
        <Offset/>
        <EventData/>
        <Footer/> 
   </Bg>
    )

}