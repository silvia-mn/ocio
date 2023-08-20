import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import UserIcon from './UserIcon';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AddTaskIcon from '@mui/icons-material/AddTask';
import LogoutIcon from '@mui/icons-material/Logout';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import HistoryIcon from '@mui/icons-material/History';
import { Link, useNavigate } from 'react-router-dom';
import { Typography } from '@mui/material';

import { AuthContext } from '../auth/AuthProvider';

export default function BasicMenu({name, surname}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const navigate = useNavigate();

  const {logOut,loaded,role} = React.useContext(AuthContext);

  const modifyRoute = loaded&&role==='user' ? '/modifyU' : (loaded&&role==='promoter' ? '/modifyP': '/home');

  return (
    <div>
      <IconButton color= 'inherit'
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <UserIcon name={name} surname={surname}/>
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
      {
        (loaded&&(role==='user'||role==='promoter'))&&
        <MenuItem onClick={handleClose}>
        <IconButton component={Link} to={modifyRoute}>
          <ManageAccountsIcon/><Typography variant='body1'>My account</Typography>
        </IconButton>
        </MenuItem>
      }
      {
        (loaded&&role==='user')&&
        <MenuItem onClick={handleClose}>
        <IconButton component={Link} to='/history'>
          <HistoryIcon/><Typography variant='body1'>History</Typography>
        </IconButton>
        </MenuItem>
      }

      {
        (loaded&&role==='admin')&&
        <MenuItem onClick={handleClose}>
        <IconButton component={Link} to='/validate'>
          <AddTaskIcon/><Typography variant='body1'>Validate Promoters</Typography>
        </IconButton>
        </MenuItem>
      }

      {
        (loaded&&role==='admin')&&
        <MenuItem onClick={handleClose}>
        <IconButton component={Link} to='/purge'>
          <DeleteForeverIcon/><Typography variant='body1'>Delete Promoters</Typography>
        </IconButton>
        </MenuItem>
      }

      <MenuItem onClick={()=>{
        handleClose();
        logOut((err)=>{
          if(!err) navigate('/home');
          else console.log(err); 
          });
        }}>
        <IconButton>
        <LogoutIcon/><Typography variant='body1'>Logout</Typography>
        </IconButton>
      </MenuItem>
      </Menu>
    </div>
  );
}