import * as React from 'react';
import { Box, TextField, Button, FormControl, Alert, MenuItem, Typography, IconButton } from '@mui/material';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import {CircularProgress} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useParams } from 'react-router-dom';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { AuthContext } from '../auth/AuthProvider';

const LoadingIcon = styled(CircularProgress)(({theme})=> ({
    color: theme.palette.secondary.main,
  }));


const RemoveIcon = styled(RemoveCircleIcon)(({ theme }) => ({
    position: "absolute",
    top: "-25%",
    right: "-3%",
}));

const StyledButton = styled(Button)(({ theme }) => ({
    ".a": {
        display: "none"
    },
    ":hover .a": {
        display: "block"
    }
}));

const RemoveButtonWrapper = ({ children, onClick }) => {
    return (
        <StyledButton variant="outlined" onClick={onClick} sx={{ position: "relative" }}>
            {children}
            <RemoveIcon className='a' fontSize='small' />
        </StyledButton>
    );
}

export default function ModifyFormE() {
    const {loaded,loginData,role} = React.useContext(AuthContext);

    const [name, setName] = React.useState('');
    const [nameChange, setNameChange] = React.useState(false);

    const [artist, setArtist] = React.useState('');
    const [artists, setArtists] = React.useState([]);
    const [artistsChange, setArtistsChange] = React.useState(false);

    const [location, setLocation] = React.useState('');
    const [locationChange, setLocationChange] = React.useState(false);

    const [capacity, setCapacity] = React.useState('');
    const [capacityChange, setCapacityChange] = React.useState(false);

    const [info, setInfo] = React.useState('');
    const [infoChange, setInfoChange] = React.useState(false);

    const [type, setType] = React.useState('');
    const [typeChange, setTypeChange] = React.useState(false);


    const [date, setDate] = React.useState('');
    const [dateChange, setDateChange] = React.useState(false)

    const [ticketType, setTicketType] = React.useState("");
    const [ticketAmount, setTicketAmount] = React.useState('');
    const [tickets, setTickets] = React.useState([]);
    const [ticketsChange, setTicketsChange] = React.useState(false);

    const minDate = new Date().toISOString().split("T")[0];

    const [successMessage, setSuccessMessage] = React.useState('');
    const [success, setSuccess] = React.useState(false);

    const [errorMessage, setErrorMessage] = React.useState('');
    const [error, setError] = React.useState(false);

    const [localLoaded, setlocalLoaded] = React.useState(false);
    const [promoter,setPromoter]=React.useState('')

    const { id } = useParams();

    const setDefault = () => {
        setArtistsChange(false);
        setLocationChange(false);
        setCapacityChange(false);
        setInfoChange(false);
        setTypeChange(false);
        setDateChange(false);
        setTicketsChange(false);
    }

    React.useEffect(() => {
        if (!localLoaded) {
            axios.get(process.env.REACT_APP_API+'/events/' + id)
                .then(response => {
                    setName(response.data.name);
                    setArtists(response.data.artists);
                    setLocation(response.data.location);
                    setCapacity(response.data.capacity);
                    setInfo(response.data.info);
                    setType(response.data.type);
                    const ddate = new Date(response.data.date);
                    setDate(`${ddate.getFullYear()}-${("0" + (ddate.getMonth() + 1)).slice(-2)}-${ddate.getDate()}`);
                    setTickets(response.data.tickets);
                    setlocalLoaded(true);
                    setPromoter(response.data.promoter);
                })
                .catch(error => {
                    setlocalLoaded(true);
                    console.error(error);
                });
        }
    }, [localLoaded,id]);

    const handleSubmit = (event) => {
        event.preventDefault();
        const eventData = {_id: id};
        console.log(artistsChange);

        if (nameChange) eventData.name = name;
        if (artistsChange) eventData.artists = artists;
        if (locationChange) eventData.location = location;
        if (capacityChange) eventData.capacity = capacity;
        if (infoChange) eventData.info = info;
        if (typeChange) eventData.type = type;
        if (dateChange) eventData.date = date;
        if (ticketsChange) eventData.tickets = tickets;

        axios({
            url: process.env.REACT_APP_API+'/promoter/events/modify',
            method: 'POST',
            withCredentials: true,
            data: eventData
        }).then((response) => {
            setSuccess(true);
            setSuccessMessage('Correctly modified!');
            setDefault();
        })
            .catch((error) => {
                setSuccess(false);
                console.log(error.response);
                if (!!error.response?.data?.error)
                    setErrorMessage(error.response.data.error);
                else
                    setErrorMessage("An error has occurred");
                setError(true);
            });
    };

    const onClose = () => {
        setError(false);
    }

    const onCloseSuccess = () => {
        setSuccess(false);
    }

    return (
        <Box minHeight={800} textAlign="center">
        {(loaded && localLoaded)?(
        <Box sx={{ display: 'flex', flexDirection: "column", alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
            {!(role!=='unlogged'&&loginData.promoter === promoter )?  
            <Typography variant='h2'>You don't have permission to modify this event.</Typography>:(
            <>
            {
                success &&
                <Alert severity="success" onClose={onCloseSuccess}>{successMessage}</Alert>
            }
            {
                error &&
                <Alert severity="error" onClose={onClose}>{errorMessage}</Alert>
            }
            <Box sx={{ width: '400px', p: 2 }}>
                <form onSubmit={handleSubmit}>
                    <FormControl variant="outlined" required fullWidth sx={{ mb: 2, width: '100%' }}>
                        <TextField
                            required
                            label="Event Name"
                            value={name}
                            onChange={(event) => {setName(event.target.value); setNameChange(true);}}
                            sx={{ width: '100%' }}
                        />
                    </FormControl>
                    <FormControl variant="outlined">
                        {artists.length !== 0 &&
                            <FormControl fullWidth>
                                <Typography variant='body1' textAlign="center">Artists:</Typography>
                                {artists.map((artist) => (
                                    <RemoveButtonWrapper key={artist} onClick={() => { setArtists(artists.filter(item => item !== artist)); setArtistsChange(true); }}>
                                        <Typography variant="body2">{artist}</Typography>
                                    </RemoveButtonWrapper>
                                ))}
                            </FormControl>
                        }
                        <TextField
                            label="Add artists"
                            value={artist}
                            onChange={(event) => setArtist(event.target.value)}
                            sx={{ width: '100%', marginTop: 2 }}
                        />
                        <IconButton onClick={() => {
                            if (artists.includes(artist)) {
                                setError(true);
                                setErrorMessage('Artist has already been added');
                            } else{
                                setArtists([...artists, artist]); setArtist('');
                                setArtistsChange(true);
                            }
                        }}><AddIcon /></IconButton>
                    </FormControl>
                    <FormControl variant="outlined" required fullWidth sx={{ mb: 2, width: '100%' }}>
                        <TextField
                            label="Location"
                            required
                            value={location}
                            onChange={(event) => {setLocation(event.target.value); setLocationChange(true);}}
                            sx={{ width: '100%' }}
                        />
                    </FormControl>
                    <FormControl variant="outlined" required fullWidth sx={{ mb: 2, width: '100%' }}>
                        <TextField
                            id="date"
                            label="Date"
                            type="date"
                            value={date}
                            required
                            InputLabelProps={{
                                shrink: true,
                            }}
                            InputProps={{
                                inputProps: {
                                    min: minDate,
                                },
                                placeholder: "",
                            }}
                            fullWidth
                            onChange={(event) =>{setDate(event.target.value);setDateChange(true)}}
                            sx={{ mb: 2 }}
                        />
                    </FormControl>
                    <FormControl variant="outlined" required fullWidth sx={{ mb: 2, width: '100%' }}>
                        <TextField
                            label="Capacity"
                            type="number"
                            required
                            value={capacity}
                            onChange={(event) => {setCapacity(event.target.value);setCapacityChange(true);}}
                            sx={{ width: '100%' }}
                        />
                    </FormControl>
                    <FormControl variant="outlined" required fullWidth sx={{ mb: 2, width: '100%' }}>
                        <TextField
                            label="Event Description"
                            multiline
                            required
                            value={info}
                            onChange={(event) => {setInfo(event.target.value);setInfoChange(true);}}
                            sx={{ width: '100%' }}
                        />
                    </FormControl>
                    <FormControl variant="outlined" required fullWidth sx={{ mb: 2, width: '100%' }}>
                        <TextField
                            label="Type"
                            select
                            required
                            value={type}
                            onChange={(event) => {setType(event.target.value);setTypeChange(true)}}
                            sx={{ width: '100%' }}
                        >
                            <MenuItem key="festival" value={"festival"}>
                                Festival
                            </MenuItem>
                            <MenuItem key="concert" value={"concert"}>
                                Concert
                            </MenuItem>
                            <MenuItem key="party" value={"party"}>
                                Party
                            </MenuItem>
                            <MenuItem key="theater" value={"theater"}>
                                Theater
                            </MenuItem>
                            <MenuItem key="performance" value={"performance"}>
                                Performance
                            </MenuItem>
                        </TextField>
                    </FormControl>
                    <Box width="100%">
                        {tickets.length !== 0 &&
                            <FormControl fullWidth>
                                <Typography variant='body1' textAlign="center">Tickets:</Typography>
                                {tickets.map((ticket) => (
                                    <RemoveButtonWrapper key={ticket} onClick={() => { setTickets(tickets.filter(item => item.type !== ticket.type)); setTicketsChange(true); }}>
                                        <Typography variant="body2">{`${ticket.type} : $${ticket.amount}`}</Typography>
                                    </RemoveButtonWrapper>
                                ))}
                            </FormControl>
                        }
                    </Box>
                    <FormControl variant="outlined" sx={{ display: "flex", flexDirection: "row" }} fullWidth>
                        <TextField
                            label="Ticket Type"
                            value={ticketType}
                            onChange={(event) => setTicketType(event.target.value)}
                            sx={{ width: '50%', marginTop: 2 }}
                        />
                        <TextField
                            label="Ticket Price"
                            type="number"
                            value={ticketAmount}
                            onChange={(event) => setTicketAmount(event.target.value)}
                            sx={{ width: '50%', marginTop: 2 }}
                        />
                        <IconButton onClick={() => {
                            if (tickets.some(t => t.type === ticketType)) {
                                setError(true);
                                setErrorMessage('Ticket type has already been added');
                            } else{
                                setTickets([...tickets, { type: ticketType, amount: ticketAmount }]); setTicketType(""); setTicketAmount(0);
                                setTicketsChange(true);
                            }
                        }}><AddIcon /></IconButton>
                    </FormControl>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <Button variant="contained" type="submit" sx={{ width: '100%', mt: 2 }}>Modify </Button>
                    </FormControl>
                </form>
            </Box>
            </>)
            }
        </Box>)
        :(
            <LoadingIcon/>
        )}
        </Box>
    );
};
