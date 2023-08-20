import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TableVirtuoso } from 'react-virtuoso';
import {useState,useEffect} from 'react';
import { styled } from '@mui/material/styles';
import { Typography, CircularProgress } from '@mui/material';
import Box from '@mui/material/Box';
import axios from 'axios';

const LoadingIcon = styled(CircularProgress)(({theme})=> ({
    color: theme.palette.secondary.main,
}));
const FlexBox = styled(Box)(({theme})=> ({
    display: "flex",
    flexFlow: "row wrap",
    justifyContent: "space-around",
    alignContent:"right",
    color: theme.palette.secondary.main,
    padding: theme.spacing(4),
}));



const columns = [
  {
    width: 200,
    label: 'Event',
    dataKey: 'event',
  },
  {
    width: 120,
    label: 'Amount\u00A0',
    dataKey: 'amount',
    numeric: true,
  },
  {
    width: 120,
    label: 'Date\u00A0',
    dataKey: 'date',
    numeric: true,
  },
  {
    width: 120,
    label: 'Payment Id\u00A0',
    dataKey: 'paymentId',
    numeric: true,
  },
];


const VirtuosoTableComponents = {
  Scroller: React.forwardRef((props, ref) => (
    <TableContainer component={Paper} {...props} ref={ref} />
  )),
  Table: (props) => (
    <Table {...props} sx={{ borderCollapse: 'separate', tableLayout: 'fixed' }} />
  ),
  TableHead,
  TableRow: ({ item: _item, ...props }) => <TableRow {...props} />,
  TableBody: React.forwardRef((props, ref) => <TableBody {...props} ref={ref} />),
};

function fixedHeaderContent() {
  return (
    <TableRow>
      {columns.map((column) => (
        <TableCell
          key={column.dataKey}
          variant="head"
          align={column.numeric || false ? 'right' : 'left'}
          style={{ width: column.width }}
          sx={{
            backgroundColor: 'violet',
          }}
        >
          {column.label}
        </TableCell>
      ))}
    </TableRow>
  );
}

function rowContent(_index, row) {
  return (
    <React.Fragment>
      {columns.map((column) => (
        <TableCell
          key={column.dataKey}
          align={column.numeric || false ? 'right' : 'left'}
        >
          {row[column.dataKey]}
        </TableCell>
      ))}
    </React.Fragment>
  );
}

export default function ReactVirtualizedTable() {
  const [loaded,setLoaded] = useState(false);
  const [hasItems,setHasItems] = useState(false);
  const [rows, setRows] = useState([]);

  useEffect(()=>{
    axios.get(process.env.REACT_APP_API+'/user/transactions',{withCredentials:true})
    .then((response)=>{
        setLoaded(true);
        if (response.data.length===0){
            setHasItems(false);
            setLoaded(true);
            
        }else{
            setHasItems(true);
            setRows(response.data.map(item => ({
                    event: item.event.name,
                    amount: item.amount,
                    date: new Date(item.date).toLocaleDateString(),
                    paymentId:item.paymentId
                }))
                );
            setLoaded(true);
        }
    })
    .catch((err)=>{
        setLoaded(true);
        setHasItems(false);
    })
},[])
  return (<FlexBox>
   {hasItems?
    <Paper style={{ height: 400, width: '100%' }}>
      <TableVirtuoso
        data={rows}
        components={VirtuosoTableComponents}
        fixedHeaderContent={fixedHeaderContent}
        itemContent={rowContent}
      />
    </Paper>
    :
    <>
    {loaded && <Typography variant="h3">YOU DON'T HAVE ANY PURCHASE YET</Typography>}
    </>
   }
    </FlexBox>);
   
}