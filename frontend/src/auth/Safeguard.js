import React, {useContext,useState,useEffect} from 'react';
import {useLocation} from 'react-router-dom';

import { AuthContext } from './AuthProvider';
import NoAccess from '../pages/NoAccess';

const Safeguard = ({children, reqRole='user', message="This page is offlimits!"}) => {
  const location = useLocation();
  const {loaded,role,UPData} = useContext(AuthContext);
  //local loaded var to avoid flickering
  const [localLoaded,setLocalLoaded] = useState(false);
  const [hasPermission,setHasPermission] = useState(false);

  useEffect(()=>{
    if(loaded){
      if(reqRole==="validatedPromoter"){
        if (role==="promoter" && UPData && UPData.validated){
          setHasPermission(true);
          setLocalLoaded(true);
        }
        else{
          setHasPermission(false);
          setLocalLoaded(true);
        }
      }else{
        if(role === reqRole){
            setHasPermission(true);
            setLocalLoaded(true);
        }
        else{
            setHasPermission(false);
            setLocalLoaded(true);
        }
      }
    }
  },[loaded,localLoaded,hasPermission,reqRole,UPData,role])

  useEffect(()=>{
    if (localLoaded)
        setLocalLoaded(false);
  },[location])

    return (
        !localLoaded ? <div></div> :
        (hasPermission ?
        <div>{children}</div>
        : <NoAccess message={message}/>)
    );
};

export default Safeguard;
