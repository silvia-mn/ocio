import * as React from 'react';
import Button from '@mui/material/Button';
import { Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText } from '@mui/material';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../auth/AuthProvider';

export default function DeleteButton({type='user'}) {

  const {forceReload} = React.useContext(AuthContext);
  const [openD,setOpenD] = React.useState(false);
  const [error,setError] = React.useState("");
  const [success,setSuccess]=React.useState(false);

  const handleDelete = (type) =>{
    axios.get(process.env.REACT_APP_API+'/'+type+'/delete',
    {withCredentials: true}).then(()=>{
        setSuccess(true);
    }).catch((err)=>{
        console.log(err);
        setError("An error occurred.");
    });
}

    const handleCloseD = () => {
        setOpenD(false);
    };

  return (<>
      <Button variant="contained" onClick={()=>setOpenD(true)}>Delete Account</Button>

      <Dialog
        open={openD}
        onClose={handleCloseD}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"DELETE ACCOUNT"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          {error==="" ? ( success ? <>Your account has been deleted</>:<>Are you sure you want to delete your account?</> ): <>{error}</>}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {success ? <Button component={Link} to="/home" onClick={forceReload}>Go back</Button> : <Button onClick={handleCloseD}>Cancel</Button>}
          {!success && <Button onClick={()=>handleDelete(type)} autoFocus> {error!=="" ? <>Try Again</> : <>Delete</>}</Button>}
        </DialogActions>
      </Dialog>
      </>
  );
}