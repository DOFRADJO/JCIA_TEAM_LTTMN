import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import HomePage from './pages/HomePage';
import ResultsPage from './pages/ResultsPage';
import { Box, CircularProgress } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4a8c5e',
    },
    secondary: {
      main: '#f8b400',
    },
    background: {
      default: '#f9f9f9',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", sans-serif',
  },
});

function App() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        {isLoading ? (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh' 
          }}>
            <CircularProgress size={60} thickness={4} />
          </Box>
        ) : (
          <Routes>
            <Route 
              path="/" 
              element={<HomePage setLoading={setIsLoading} />} 
            />
            <Route 
              path="/results" 
              element={<ResultsPage setLoading={setIsLoading} />} 
            />
          </Routes>
        )}
      </Router>
    </ThemeProvider>
  );
}

export default App;