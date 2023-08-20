import { styled } from '@mui/material/styles';
import CustomAppBar from "../components/CustomAppBar";
import Footer from "../components/Footer";
import ModifyFormE from '../components/ModifyFormE';

import { useContext } from 'react';

import bg_image from "../assets/bg.jpeg"

const Bg = styled('div')(({ theme }) => ({
  backgroundImage : `url(${bg_image})`,
  backgroundPosition: "50% 20%",
  minHeight: '100vh',
  minWidth:'100vw',
  backgroundSize: 'cover'
}));

const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);

export default function ModifyEvent(){
    return(
      <Bg>
      <CustomAppBar/>
      <Offset/>
        <ModifyFormE/>
      <Footer/> 
    </Bg>
  );
}