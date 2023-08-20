import React, {useState,useEffect} from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea,Container } from '@mui/material';
import {Link} from 'react-router-dom';

import { styled } from "@mui/material/styles";

// The card style object
const cardStyle = {
    height: 256,
    width: 256+128,
    marginBottom:4,
};

// The image style object
const imageStyle = {
    height: 256,
    width: '100%',
};

const EventCardMedia = styled('div')(({ theme }) => ({
  position: "relative",
  "& .hl-text-container": {
    position: "absolute",
    bottom: theme.spacing(2),
    left: 0,
    padding: theme.spacing(2),
    backgroundColor: theme.palette.primary.main_translucent,
    color: theme.palette.primary.contrastText,
  }
}));

export default function EventCard({
    eventId='',
    eventTitle="Default Fest",
    eventDate= new Date(),
    eventLocation = "Default City",
    eventImageName='/default/event_card0.jpeg'}) {

    //Asynchronously import image
    const [eventImage,setEventImage] = useState("");
    
    useEffect(()=>{
        import('../assets/'+eventImageName).then((image)=> setEventImage(image.default))
    },[eventImage])

    return (
        <Card sx={cardStyle}>
        <CardActionArea component={Link} to={"/event/"+eventId}>
            <EventCardMedia>
                <CardMedia
                    component="img"
                    image={eventImage}
                    sx ={imageStyle}
                    position="relative"
                />
                <Container class="hl-text-container">
                    <Typography gutterBottom variant="h5" component="div">
                        {eventTitle}
                    </Typography>
                    <Typography gutterBottom variant="h6" component="div">
                        {`${eventDate.toLocaleDateString('en-US',{
                            month: 'long',
                            day: 'numeric'
                        })} - ${eventLocation}`}
                    </Typography>
                </Container>
            </EventCardMedia>
        </CardActionArea>
        </Card>
    );
}