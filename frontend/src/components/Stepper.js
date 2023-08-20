import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Payment from './CreditCard/Payment';
import styled from '@emotion/styled';
import { Button, Typography,Alert, CircularProgress } from '@mui/material';
import SelectTickets from './SelectTickets';
import QRCode from "react-qr-code";
import axios from 'axios';

const LoadingIcon = styled(CircularProgress)(({theme})=> ({
  color: theme.palette.secondary.main,
}));

const steps = [
  'Number of tickets',
  'Payment',
  'Success!'
];

export default function MyStepper({type,price,back,eventData}) {
  const [activeStep, setActiveStep] = React.useState(0);
  const [count, setCount] = React.useState(1);
  const [paymentId,setPaymentId] = React.useState(null);
  const [loading,setLoading] = React.useState(false);

  const [error,setError] = React.useState(false);
  const [errorMessage,setErrorMessage] = React.useState("");

  const handleNext = () => {
    if(activeStep === 0 && count >eventData.capacity){
      setError(true);
      setErrorMessage('Not enough tickets available');
    }else
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const downloadPdf= (payment_id,eventName,ticketType,totalAmount,numTics)=>{
    setLoading(true);
    axios({
      url : process.env.REACT_APP_API+'/pdf',
      method: 'POST',
      data: {
        paymentId:payment_id,
        eventName:eventName,
        ticketType:ticketType,
        totalAmount: totalAmount,
        numTics: numTics
      }
    }).then((response)=>{
      const link = document.createElement('a');
      link.href = response.data;
      link.setAttribute('download', 'ticket.pdf');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      setLoading(false);
    });
  }


  const onClose = ()=>{
    setError(false);
  }

  const handleBack = () => {
    if (activeStep===0){
      back();
    }else{
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }
  };

  React.useEffect(()=>{
    if(!!paymentId){
      setActiveStep(2);
    }
  },[paymentId]);

  return (
    <Box sx={{ display:'flex', flexDirection:'column', alignContent:"space-around"}}>
      {
          error &&
            <Alert severity="error" margin={50} onClose={onClose}>{errorMessage}</Alert>
      }
      {activeStep!==2 &&
      <Box>
        <Button variant='contained' onClick={handleBack}>Back</Button>
        <Button variant='contained' onClick={handleNext} disabled={activeStep === 1}>Next</Button>
      </Box>}
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box>
        {activeStep === 0 && <SelectTickets setParentCount={setCount} type={type} amount={price} rcvCount={count}/>}
        {activeStep === 1 && <Payment eventData={eventData} ticketCount={count} ticketPrice={price} ticketType={type} setPaymentId={setPaymentId}/>}
        {activeStep === 2 && !!paymentId &&
          <Box sx={{justifyContent:"center", textAlign:"center", alignContent:"center", marginTop:8}}>
            <Typography variant="h1">PURCHASE COMPLETED.</Typography>
            <Typography variant="h3">Here is the QR to enter the event, enjoy.</Typography>
            <Box sx={{padding:4, backgroundColor:"white", width:"fit-content",margin:"auto",marginTop:8}}>
              <QRCode value={paymentId}/>
            </Box>
            {loading ? <LoadingIcon/>:
            <Button onClick={()=>downloadPdf(paymentId,eventData.name,type,price*count,count)}>DOWNLOAD AS PDF</Button>
            }
            </Box>
         }
      </Box>
    </Box>
  );
}
