import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    background: {
      default: '#e0f7fa', 
      paper: '#ffffff',
    },
    primary: {
        main: '#6F7978',
    },
    secondary: {
        main: '#F4FBF9',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
},
});

export default theme;

