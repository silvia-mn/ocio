import { styled } from '@mui/material/styles';
import CustomAppBar from "../components/CustomAppBar";
import Footer from "../components/Footer";

import bg_image from "../assets/bg.jpeg"
import { Typography,Box } from '@mui/material';

const Bg = styled('div')(({ theme }) => ({
  backgroundImage : `url(${bg_image})`,
  backgroundPosition: "50% 20%",
  minHeight: '100vh',
  minWidth:'100vw',
  backgroundSize: 'cover'
}));

const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);

export default function NoAccess({message="This page is offlimits!"}){
    return(
      <Bg>
      <CustomAppBar/>
      <Offset/>
      <Box minHeight={800} textAlign="center">
        <Typography variant="h1" margin={10}>
            {message}
        </Typography>
      </Box>
      <Footer/> 
    </Bg>
  );
}