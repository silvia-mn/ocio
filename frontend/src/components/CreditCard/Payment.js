import React from "react";
import Card from "react-credit-cards";
import { styled } from '@mui/material/styles';
import { CircularProgress,Alert } from "@mui/material";
import CryptoES from 'crypto-es'

import SupportedCards from "./Cards";
import "./styles.css";
import axios from "axios";

import { Typography,TextField,FormControl, Button } from "@mui/material";

import {
  formatCreditCardNumber,
  formatcvv,
  formatExpirationDate,
  formatFormData
} from "./utils";

import "react-credit-cards/es/styles-compiled.css";

const LoadingIcon = styled(CircularProgress)(({theme})=> ({
  color: theme.palette.secondary.main,
}));

export default class Payment extends React.Component {
  constructor(props){
    super(props);
  }

  state = {
    number: "",
    name: "",
    expiry: "",
    cvv: "",
    issuer: "",
    focused: "",
    errors: [],
    loaded:true,
    formData: null
  };

  handleCallback = ({ issuer }, isValid) => {
    if (isValid) {
      this.setState({ issuer });
    }
  };

  handleInputFocus = ({ target }) => {
    this.setState({
      focused: target.name
    });
  };

  handleInputChange = ({ target }) => {
    if (target.name === "number") {
      target.value = formatCreditCardNumber(target.value);
    } else if (target.name === "expiry") {
      target.value = formatExpirationDate(target.value);
    } else if (target.name === "cvv") {
      target.value = formatcvv(target.value);
    }

    this.setState({ [target.name]: target.value });
  };

  handleSubmit = e => {
    e.preventDefault();
    const formData = [...e.target.elements]
      .filter(d => d.name)
      .reduce((acc, d) => {
        acc[d.name] = d.value;
        return acc;
      }, {});
    const data = {
      eventId : this.props.eventData._id,
      ticketType : this.props.ticketType,
      numCard: formData.number.replace(/\s+/g, ''),
      numTic: this.props.ticketCount,
      cvv: formData.cvv,
      expDate: `${formData.expiry.slice(0,2)}/20${formData.expiry.slice(-2)}`,
    }
    
    const encr=CryptoES.AES.encrypt(JSON.stringify(data),"verysecret");

    this.setState({loaded:false});
    axios({
      url:'http://localhost:8080/pay',
      method: 'POST',
      withCredentials: true,
      data : {encr:encr},
    }).then((response)=>{
      this.setState({loaded:true});
      this.props.setPaymentId(response.data.paymentId);
    }).catch((err)=>{
      console.log(err);
      this.setState({loaded:true});
      if (err.response.data.errors)
        this.setState({errors : err.response.data.errors});
      else if (err.response.data.error)
        this.setState({errors:[err.response.data.error]});
      else
        this.setState({errors:["An unknown error has occurred"]});
    })


    this.setState({ formData });
    this.form.reset();
  };

  render() {
    const { name, number, expiry, cvv, focused, issuer, formData } = this.state;

    return (
      <div key="Payment" style={{textAlign:'center', margin:20,padding:10}}>
        {
        !this.state.loaded && <LoadingIcon/>
        }
        {
          this.state.errors.map((err)=>(
          <Alert 
          severity="error"
          onClose={()=>{
            this.setState({errors : this.state.errors.filter(item => item !== err)})
          }}
          >
            {err}
          </Alert>
          ))
        }
        <Typography variant="h5">Proceding with payment of {this.props.ticketCount} {this.props.ticketType} ticket(s)
        for the event : {this.props.eventData.name} for a total of ${this.props.ticketCount * this.props.ticketPrice}</Typography>
        <div className="Payment-payment">
          <Card
            number={number}
            name={name}
            expiry={expiry}
            cvv={cvv}
            focused={focused}
            callback={this.handleCallback}
          />
          <form ref={c => (this.form = c)} onSubmit={this.handleSubmit} margin="normal">
            <FormControl variant="outlined" className="form-group" sx={{margin:1}}>
              <TextField
                type="tel"
                name="number"
                label="Card Number"
                className="form-control"
                pattern="[\d| ]{16,22}"
                required
                onChange={this.handleInputChange}
                onFocus={this.handleInputFocus}
              />
            </FormControl>
            <FormControl variant="outlined" className="form-group" sx={{margin:1}}>
              <TextField
                type="text"
                name="name"
                className="form-control"
                label="Name"
                required
                onChange={this.handleInputChange}
                onFocus={this.handleInputFocus}
              />
            </FormControl>
            <div className="row">
              <FormControl variant="outlined" className="col-6" sx={{margin:1}}>
                <TextField
                  type="tel"
                  name="expiry"
                  className="form-control"
                  label="Valid Thru"
                  pattern="\d\d/\d\d"
                  required
                  onChange={this.handleInputChange}
                  onFocus={this.handleInputFocus}
                />
              </FormControl>
              <FormControl variant="outlined" className="col-6" sx={{margin:1}}>
                <TextField
                  type="tel"
                  name="cvv"
                  className="form-control"
                  label="cvv"
                  pattern="\d{3,4}"
                  required
                  onChange={this.handleInputChange}
                  onFocus={this.handleInputFocus}
                />
              </FormControl>
            </div>
            <input type="hidden" name="issuer" value={issuer} />
            <FormControl className="form-actions">
              <Button variant="contained" type="submit" className="btn btn-primary btn-block" sx={{marginBottom:4}}>
                PAY
                </Button>
            </FormControl>
          </form>
          <SupportedCards justifyContent="center"/>
        </div>
      </div>
    );
  }
}
