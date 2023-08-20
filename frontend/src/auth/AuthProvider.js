import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios'

import  Cookies  from 'js-cookie';

const AuthContext = createContext();
const cookieName = 'activeSession';

/*
* Loading authorization data only once, components using this context must wait for loaded to be true
* before accesing the other variables. Reload is forced on logIn and logOut, otherwise done once on component mount.
*/
const AuthProvider = ({ children }) => {

  const [loginData, setLoginData] = useState(null);
  const [UPData,setUPData] = useState(null);
  const [loaded,setLoaded] = useState(false)
  const [role,setRole] = useState('');

  useEffect(()=>{
    if(!loaded){
      const ck =Cookies.get(cookieName);
        if (!!ck) {
          //Try to get loginData
          axios.get(process.env.REACT_APP_API+'/login',{ withCredentials: true })
          .then((response)=> {
              setLoginData(response.data);
              if(response.data.role.name==='admin'){ //isAdmin
                setLoaded(true);
                setRole('admin');
              }else if(!!response.data.promoter){ //isPromoter
                axios.get(process.env.REACT_APP_API+'/promoter',{ withCredentials: true })
                .then((response)=>{
                  setUPData(response.data);
                  setRole('promoter');
                  setLoaded(true);
                }).catch(err => console.log(err)); //The user is a promoter but cannot retreive its data (shouldn't happen)
              }else{ //isUser
                axios.get(process.env.REACT_APP_API+'/user',{ withCredentials: true })
                .then((response)=>{
                  setUPData(response.data);
                  setRole('user');
                  setLoaded(true);
                }).catch(err => console.log(err)); //The its user but cannot retreive its data (shouldn't happen)
              }
            }).catch(()=>{Cookies.remove(cookieName);setLoaded(true);setRole('unlogged');}); //failed to get login data - invalid cookie session
        }else{
          //Session cookie not found
          Cookies.remove(cookieName);
          setRole('unlogged');
          setLoaded(true);
        }
      }
  },[loaded])

  const logIn = (data,cb)=>{
    axios({
        url: process.env.REACT_APP_API+'/login',
        method: 'POST',
        withCredentials:true,
        data : data
      }).then((response)=>{
        Cookies.set(cookieName,true);
        setLoaded(false); //mark a required update to auth. status
        cb(null);
      }).catch(err => cb(err));
  }

  const logOut = (cb)=>{
    axios({
      url: process.env.REACT_APP_API+'/logout',
      method: 'GET',
      withCredentials: true
    }).then(()=>{
      Cookies.remove(cookieName);
      setLoginData(null);
      setUPData(null);
      setLoaded(false);
      cb(null);
      }
    ).catch(
      err => cb(err)
      );
  }

  const forceReload = ()=>{
      Cookies.remove(cookieName);
      setLoaded(false);
  }

  return (
    <AuthContext.Provider
      value={{
        logIn,
        logOut,
        forceReload,
        loaded,
        UPData,
        loginData,
        role,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
