import { useState } from "react";
import { styled } from '@mui/material/styles';
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import { Box } from "@mui/material";

const StyledTextField = styled(TextField)(({ theme }) => ({
    backgroundColor: theme.palette.secondary.main,
}));

export default function SearchBar ({setSearchQuery}){
    const handleInputChange = (event) => {
      setSearchQuery(event.target.value);
    };

    return(
    <Box sx={{
        display: "flex",
        width: 512,
    }}>
      <StyledTextField
        id="search-bar"
        className="text"
        onInput={handleInputChange}
        label="Search events by artist, place ..."
        labelClassName="placeholder"
        variant="filled"
        placeholder="Search..."
        InputProps={{
            sx: {
              color: 'secondary.contrastText',
            },
          }}
        InputLabelProps={{
        sx: {
            color: 'secondary.contrastText',
            '&.Mui-focused': {
                color: 'secondary.contrastText',
              },
        },
        }}
        sx={{flex:1, display:"in-line",}}
      />
      <IconButton type="submit" aria-label="search">
        <SearchIcon sx={{stroke:'purple',strokeWidth:2,fontSize:32}}/>
      </IconButton>
    </Box>
    );
}
  