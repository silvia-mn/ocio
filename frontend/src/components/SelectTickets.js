import React, { useState } from 'react';
import { ButtonGroup, Button, Typography, Box, Paper } from '@mui/material';
import Ticket from './Ticket';

export default function TicketCounter({setParentCount, type='Premium', amount=50, rcvCount=1}) {
  const [count, setCount] = useState(rcvCount);

  const handleIncrement = () => {
    setParentCount(count+ 1);
    setCount(count + 1);
  };

  const handleDecrement = () => {
    if (count > 0) {
      setParentCount(count-1);
      setCount(count-1);
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={4} height={650}>
      <Ticket type={type} amount={amount}/>
      <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
        <Typography variant="h6">Number of Tickets: {count}</Typography>
        <ButtonGroup size="large" sx={{ mt: 2 }}>
          <Button onClick={handleDecrement}>-</Button>
          <Button onClick={handleIncrement}>+</Button>
        </ButtonGroup>
      </Box>
    </Box>
  );
}
