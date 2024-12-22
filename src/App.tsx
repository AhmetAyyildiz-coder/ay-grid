import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/tr';
import './App.css'
import { Box, createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { CustomerGrid } from './features/CustomerGrid/CustomerGrid';

function App() {
  const theme = createTheme({
    palette: {
      mode: 'light',
    }
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="tr">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{
          width: '100%',
          margin: 0,
          padding: 20,
          overflow: 'hidden'
        }}>
          <CustomerGrid />
        </Box>
      </ThemeProvider>
    </LocalizationProvider>
  );
}

export default App;
