import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import EditNoteIcon from '@mui/icons-material/EditNote';
import { Link } from 'react-router-dom';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const ITEM_HEIGHT = 48;

const StyledIconButton = styled(IconButton)(({theme})=> ({
  color:theme.palette.secondary.contrastText,
  backgroundColor:theme.palette.secondary.main,
  ":hover":{
    backgroundColor:theme.palette.secondary.main,
  }
}));


export default function LongMenu({children, deleteEvent, eventId}) {

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [error,setError] = React.useState("");
  
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [openD, setOpenD] = React.useState(false);

  const handleClickOpen = () => {
    handleClose();
    setOpenD(true);
  };

  const handleCloseD = () => {
    setOpenD(false);
  };

  return (
    <div style={{position:'relative'}}>
      {children}
      <div style={{position:'absolute',top:"-6%",right:"-5%"}}>
      <StyledIconButton
        size= "medium"
        aria-label="more"
        id="long-button"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined} 
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon/>
      </StyledIconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: '20ch',
          },
        }}
      >
        <MenuItem key="Delete event" onClick={handleClickOpen}>
          <RemoveCircleIcon/>
          Delete event
        </MenuItem>

        <MenuItem component={Link} to={"/modify/"+eventId} key="Modify event" onClick={handleClose}>
          <EditNoteIcon/>
          Modify event
        </MenuItem>
      </Menu>
      <Dialog
        open={openD}
        onClose={handleCloseD}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"DELETE EVENT"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          {error==="" ? <>Are you sure you want to delete the event?</>: <>{error}</>}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseD}>Cancel</Button>
          <Button onClick={()=>{
            axios({
              url:process.env.REACT_APP_API+'/promoter/events/delete',
              method:'POST',
              withCredentials:true,
              data:{id: eventId}
            }).then(()=>{
              deleteEvent(eventId);
              handleCloseD();
            }).catch((err)=>{
              console.log(err);
              setError("An error occurred.");
            })
          }} autoFocus> {error!=="" ? <>Try Again</> : <>Delete</>}</Button>
        </DialogActions>
      </Dialog>
      </div>
    </div>
  );
}