import {useState,useEffect} from 'react'
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { Typography, CircularProgress } from '@mui/material';
import PromoterTable from './PromoterTable';

const LoadingIcon = styled(CircularProgress)(({theme})=> ({
    color: theme.palette.secondary.main,
}));

export default function ValidationList({mode='unvalidated'}){
    const [unvalidatedPromoters,setUnvalidatedPromoters] = useState([]);
    const [loaded,setLoaded] = useState(false);
    const [hasItems,setHasItems] = useState(false); 

    const url=mode === 'unvalidated' ? process.env.REACT_APP_API+'/promoters' : process.env.REACT_APP_API+'/promoters/all';

    useEffect(()=>{
        axios.get(url,{withCredentials:true})
        .then((response)=>{
            setUnvalidatedPromoters(response.data);
            setLoaded(true);
            if (response.data.length===0){
                setHasItems(false);
            }else{
                setHasItems(true);
            }
        })
        .catch((err)=>{
            setLoaded(true);
            setHasItems(false);
        })
    },[url])

    return(
        loaded ? 
            (hasItems ?(
                <PromoterTable rows={unvalidatedPromoters} setRows={setUnvalidatedPromoters} mode={mode}/>
        ) : <Typography variant="h2">Nothing to see here ...</Typography>)
        : <LoadingIcon/>
    );

}