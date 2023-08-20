import { Box } from "@mui/material";
import logo_white from "../assets/logo_blanco.png";
import logo_black from "../assets/logo_negro.png";

export default function Logo ({color = 'white', maxHeight=70}){
    const image = color==='white'?logo_white:logo_black;
    return(
        <Box component='img' src={image} sx={{maxHeight:{maxHeight},objectFit:'contain'}}></Box>
    );
}