import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import { deepOrange, deepPurple, teal, pink, amber } from '@mui/material/colors';




const getRandomColor = () => {
    const colors = [deepOrange[500], deepPurple[500], teal[500], pink[500], amber[500]];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };
  const getLetters = (name,surname) =>{
    return name.toUpperCase()[0]+surname.toUpperCase()[0];
  };


export default function LetterAvatars({name= 'Silvia', surname= 'Munoz'}) {
  const [color,setColor] = React.useState(deepOrange[500]);

  React.useEffect(()=>{
    setColor(getRandomColor());
  },[])

  return (   
      <Avatar style={{ backgroundColor: color }}>{getLetters(name, surname)}</Avatar>

  );
}
