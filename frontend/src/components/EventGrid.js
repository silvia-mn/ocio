import EventCard from "./EventCard";
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { CircularProgress } from "@mui/material";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { AuthContext } from "../auth/AuthProvider";
import EventMenu from './EventMenu';

const FlexBox = styled(Box)(({theme})=> ({
    display: "flex",
    flexFlow: "row wrap",
    justifyContent: "space-around",
    alignContent:"right",
    padding: theme.spacing(4),
}));

const LoadingIcon = styled(CircularProgress)(({theme})=> ({
    color: theme.palette.secondary.main,
}));

export const NUM_IMAGES = 9;

export const DEFAULT_IMAGES = [...Array(NUM_IMAGES).keys()].map((i)=>{
    return(`default/event_card${i}.jpeg`)
})



export default function BasicGrid({searchQuery}) {
    const [events, setEvents] = useState([]);
    const [localLoaded, setLocalLoaded] = useState(false);
    const [hasItems, setHasItems] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    const eventsPerPage = 20; // Number of events to display per page

    const {loaded,role} = useContext(AuthContext);

    const deleteEvent = (id)=>{
        setEvents(events.filter(item => item._id !== id));
    }

    useEffect(() => {
      if (!localLoaded&&loaded){
        if(role==='promoter'){
            axios.get(process.env.REACT_APP_API+'/promoter/events',{withCredentials:true})
            .then(response => {
                setEvents(response.data);
                setLocalLoaded(true);
                if (response.data.length === 0){
                    setHasItems(false);
                }else{
                    setHasItems(true);
                }
            })
            .catch(error => {
                console.log(error)
            });
        }else{
            if (searchQuery===''){
                axios.get(process.env.REACT_APP_API+'/events')
                    .then(response => {
                        setEvents(response.data);
                        setLocalLoaded(true);
                        if (response.data.length === 0){
                            setHasItems(false);
                        }else{
                            setHasItems(true);
                        }
                    })
                    .catch(error => {
                        console.log(error)
                    });
            }else{
                axios.post(process.env.REACT_APP_API+'/events/search',{search:searchQuery})
                .then(response => {
                    setEvents(response.data);
                    setLocalLoaded(true);
                    if (response.data.length === 0){
                        setHasItems(false);
                    }else{
                        setHasItems(true);
                    }
                })
                .catch(error => {
                    if(error.response.status === 404){
                        setLocalLoaded(true);
                        setHasItems(false);
                    }
                });
            }
        }
      }
    }, [localLoaded,loaded,role,searchQuery]);

    useEffect(()=>{
        setLocalLoaded(false);
        setCurrentPage(1);}
    ,[searchQuery]);

    const limitedEvents = events.slice((currentPage - 1) * eventsPerPage, currentPage * eventsPerPage);
    
    const handlePageChange = (event, page) => {
        setCurrentPage(page);
      };
    
      const totalPages = Math.ceil(events.length / eventsPerPage);    
    
      return (
        <>
        <FlexBox>{
            localLoaded ? 
                hasItems ?(
                <>
                {
                limitedEvents.map(event => (<>
                    {(role==='promoter')
                    ?
                    <EventMenu eventId={event._id} deleteEvent={deleteEvent}> <EventCard key={event._id}
                    eventId = {event._id}
                    eventDate={new Date(event.date)}
                    eventTitle={event.name}
                    eventLocation={event.location}
                    eventImageName={DEFAULT_IMAGES[event._id.charCodeAt(event._id.length -1) % NUM_IMAGES]}/></EventMenu>
                    :
                    <EventCard key={event._id}
                    eventId = {event._id}
                    eventDate={new Date(event.date)}
                    eventTitle={event.name}
                    eventLocation={event.location}
                    eventImageName={DEFAULT_IMAGES[event._id.charCodeAt(event._id.length -1) % NUM_IMAGES]}/>
                    }
                    </>
                ))
                }
                <Stack direction="row" spacing={2} justifyContent="center" mt={4}>
                <Pagination
                  color="secondary" 
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                />
                </Stack>
                </>
                ): <Typography variant="h3">Nothing to see here ...</Typography>
            : <LoadingIcon/>
            }
        </FlexBox>
        
    </>
  );
}