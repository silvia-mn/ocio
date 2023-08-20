import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';
import {CircularProgress} from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import axios from 'axios';

import AddTaskIcon from '@mui/icons-material/AddTask';
import { IconButton } from '@mui/material';

const LoadingIcon = styled(CircularProgress)(({theme})=> ({
    color: theme.palette.secondary.main,
}));

const ValidateButton = ({pid,onClick}) =>{
    const [loaded,setLoaded] = React.useState(true);

    return(
        <IconButton onClick={()=>onClick(pid,setLoaded)}>
        {loaded ? <AddTaskIcon color="success"/> : <LoadingIcon/>}
        </IconButton>
    );
}

const DeleteButton = ({pid,onClick}) =>{
  const [loaded,setLoaded] = React.useState(true);

  return(
      <IconButton onClick={()=>onClick(pid,setLoaded)}>
      {loaded ?  <DeleteForeverIcon color="error"/>: <LoadingIcon/>}
      </IconButton>
  );
}

const columns = [
  { id: 'name', label: 'Name',   },
  { id: 'email', label: 'Email',   },
  { id: 'cif', label: 'CIF',   },
  { id: 'phone', label:'Phone',  },
  { id: 'personInCharge', label:'Person In Charge',  },
  { id: 'registeredOffice', label:'Registered Office',  },
  { id: 'socialCapital', label:'Social Capital',  },
];

export default function StickyHeadTable({rows,setRows, mode='unvalidated'}) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const url = (mode==='unvalidated') ? process.env.REACT_APP_API+'/promoters/validate' : process.env.REACT_APP_API+'/promoters/delete';
  const VarButton = (mode==='unvalidated') ? ValidateButton : DeleteButton ;

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleClick=(pid,setLoaded)=>{
    setLoaded(false)
    axios({
        url: url,
        method: 'POST',
        withCredentials: true,
        data: {
            id : pid,
        },
      }).then(()=>{
        setRows(rows.filter(item=>item._id!==pid));
        setLoaded(true);
      }).catch(()=>{
        setLoaded(true);
      });
  }

  return (
    <Paper sx={{ overflow: 'hidden', marginTop:10, marginBottom:20, height:'100%' }}>
      <TableContainer>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
              <TableCell key="Validate">Validate</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.cif}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === 'number'
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                    <TableCell key="Validate" align="center"><VarButton pid={row._id} onClick={handleClick}/></TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}