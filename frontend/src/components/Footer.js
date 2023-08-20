import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledFooter = styled('footer')(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(2),
}));

const Footer = () => {
  return (
    <StyledFooter>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="body2" component="p">
          Contact us: support@example.com
        </Typography>
        <Typography variant="body2" component="p">
          Follow us on Twitter: @example
        </Typography>
      </Box>
    </StyledFooter>
  );
};

export default Footer;
