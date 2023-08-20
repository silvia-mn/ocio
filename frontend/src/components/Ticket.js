import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import imTicket from '../assets/ticket.png';

const TicketContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(2),
  width:theme.spacing(24),
  position: "absolute",
  bottom:"45%",
  left:"50%",
  transform:"translate(-50%,50%)"
}));

const Ticket = ({ type='Premium', amount=100 }) => {
    return (
     <Box position="relative">
      <Box component="img" src={imTicket} width={400}/>
      <TicketContainer >
          <Typography variant="body1" sx={{fontWeight:'bold'}}>
            Ticket Type: {type}
          </Typography>
          <Typography variant="body2">
            Amount: {amount}
          </Typography>
        </TicketContainer>
     </Box>
    );
  };
  
  export default Ticket;
