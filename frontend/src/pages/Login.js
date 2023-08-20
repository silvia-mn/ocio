import LoginForm from '../components/Login';
import { styled } from '@mui/material/styles';
import CustomAppBar from "../components/CustomAppBar";
import Footer from "../components/Footer";

import bg_image from "../assets/bg.jpeg"

const Bg = styled('div')(({ theme }) => ({
  backgroundImage : `url(${bg_image})`,
  backgroundPosition: "50% 20%",
  minHeight: '100vh',
  minWidth:'100vw',
  backgroundSize: 'cover'
}));

const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);

export default function LoginPage(){
  return(
    <Bg>
      <CustomAppBar/>
      <Offset/>
      <LoginForm/>
      <Footer/> 
    </Bg>
  
  )
}