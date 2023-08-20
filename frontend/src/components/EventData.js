import React, { useState, useEffect, useContext } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Container, Grid} from '@mui/material';
import axios from 'axios';
import { CircularProgress, Button,Alert } from "@mui/material";
import { styled } from '@mui/material/styles';
import Ticket from './Ticket';
import Stepper from './Stepper';
import { useParams } from 'react-router-dom';

import { DEFAULT_IMAGES, NUM_IMAGES } from './EventGrid';
import { AuthContext } from '../auth/AuthProvider';

const LoadingIcon = styled(CircularProgress)(({theme})=> ({
    color: theme.palette.secondary.main,
}));

const StyledButton= styled(Button)(({ theme }) => ({
  margin: theme.spacing(6),
}));

export default function EventData (){
    const [event, setEvent] = useState(null);
    const [localLoaded, setlocalLoaded] = useState(false);
    //Asynchronously import image
    const [eventImage,setEventImage] = useState("");

    const {loaded,role} = useContext(AuthContext);
    const [error,setError] = useState(false);
    const [errorMessage,setErrorMessage] = useState("");

    const {id} = useParams();
    const eventImageName = DEFAULT_IMAGES[id.charCodeAt(id.length -1) % NUM_IMAGES];

    const [ticketType,setTicketType] = useState('');
    const [price,setPrice]=useState(-1);

    useEffect(()=>{
      import('../assets/'+eventImageName).then((image)=> setEventImage(image.default))
    },[eventImage]);

    const handleTicketClick= (ticketType,price)=>{
      if( loaded && (role!=='user')) {
        setError(true);
        setErrorMessage('Log in as a user to proceed with a purchase');
      }else{
        if(localLoaded){
          if (event.capacity>0){
            setTicketType(ticketType);
            setPrice(price);
          }else{
            setError(true);
            setErrorMessage('We are completely sold out!');
          }
        }
      }
    }

    const onClose = ()=>{
      setError(false);
    }

    useEffect(() => {
        if (!localLoaded){
          axios.get(process.env.REACT_APP_API+'/events/'+id)
              .then(response => {
                  setEvent(response.data);
                  setlocalLoaded(true);
              })
              .catch(error => {
                setlocalLoaded(true);
                console.error(error);
              });
        }
      }, [localLoaded]);

    const exists = !!event;

    return(
        
      <Container sx={{minHeight:750}}>
      {localLoaded ? (
        exists ? ( 
          ticketType!=='' ? 
          (
            <Stepper type={ticketType} price={price} back={()=>setTicketType('')} eventData={event}/>
          )
          :(
          <div> 
          {
          error &&
            <Alert severity="error" margin={50} onClose={onClose}>{errorMessage}</Alert>
          }
          <Grid container spacing={2} >
            <Grid item xs={14} display="flex" justifyContent="start">
              
            </Grid>
            <Grid item xs={14} display="flex" justifyContent="start" alignItems="center">
              <Box display="flex" justifyContent="center" alignItems="center">
                <Grid container spacing={2} justifyContent="center" alignItems="center">
                  <Grid item sm={6}>
                    <Box display="flex" justifyContent="start" alignItems="center" flexDirection="column">
                      <img src={eventImage} alt="Event Image" style={{ maxWidth: '300px', marginBottom: '20px' }} />
                      <Typography variant="h1" align="center">{event.name}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Box marginBottom="10px">
                      <Typography variant="h3">Artists:</Typography>
                      {event.artists.map(artist =>
                        <Typography variant="h6" align="start">{artist}</Typography>)}
                      
                    </Box>
                    <Box marginBottom="10px">
                      <Typography variant="h3">Location:</Typography>
                      <Typography variant="h6" align="start">{event.location}</Typography>
                    </Box>
                    <Box marginBottom="10px">
                      <Typography variant="h3">Capacity:</Typography>
                      <Typography variant="h6" align="start">{event.capacity}</Typography>
                    </Box>
                    <Box marginBottom="10px">
                      <Typography variant="h3">Info:</Typography>
                      <Typography variant="h6" align="start">{event.info}</Typography>
                    </Box>
                    <Box marginBottom="10px">
                      <Typography variant="h3">Date:</Typography>
                      <Typography variant="h6" align="start">{`${new Date(event.date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric'
                      })} - ${new Date(event.date).toLocaleTimeString('en-US')}`}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={3} alignItems="end">
                    {event.tickets.map((ticket, index) => (
                        <StyledButton onClick={()=>handleTicketClick(ticket.type,ticket.amount)}>
                        <Ticket type={ticket.type} amount={ticket.amount} />
                        </StyledButton>
                    ))}
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
           
         </div>
        )) : (
          <Typography variant="h3">Nothing to see here ...</Typography>
        )
      ) : (
        <LoadingIcon />
      )}
    </Container>
  );
}



    
