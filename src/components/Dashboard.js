import React, { useState, useEffect } from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import { Container, IconButton, Box, Typography, Tooltip, AppBar, Toolbar, Avatar, Snackbar, Alert } from '@mui/material';
import StockData from './Stock.js';
import AboutUs from './Aboutus';
import ContactUs from './ContactUs';
import MenuIcon from '@mui/icons-material/Menu';
import Sidebar from './Sidebar';
import News from './News';
import Profile from './Profile';
import StockPredictionForm from './predict';
import HomeIcon from '@mui/icons-material/Home';

// Logout Component
const Logout = () => {
  return <Typography variant="h5">Logout Page</Typography>;
};

// Stock Terms Component
const StockTerms = ({ onSelect }) => {
  const terms = [
    { label: 'Short', color: '#FF5733', description: 'Suitable for quick trades' },
    { label: 'Long', color: '#28A745', description: 'Best for long-term investments' },
    { label: 'Hold', color: '#FFC107', description: 'Ideal for holding stocks' },
  ];

  return (
    <Box display="flex" justifyContent="space-around" mb={2}>
      {terms.map(term => (
        <Tooltip title={term.description} arrow key={term.label}>
          <Box
            onClick={() => onSelect(term.label)}
            sx={{
              backgroundColor: term.color,
              color: '#FFFFFF',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.1)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
              },
              width: '120px',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{term.label}</Typography>
          </Box>
        </Tooltip>
      ))}
    </Box>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await fetch('/api/profile', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUsername(data.username);
        } else {
          console.error('Failed to fetch user data');
        }
      }
    };

    fetchUserData();
  }, []);

  const handleTermSelect = (term) => {
    setMessage(`You selected: ${term}`);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* AppBar */}
      <AppBar position="fixed" sx={{ zIndex: 1201 }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={toggleSidebar}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Welcome, {username || 'User'}
          </Typography>
          <Avatar>{username.charAt(0).toUpperCase()}</Avatar>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} username={username} />

      {/* Content Area */}
      <Container
        sx={{
          marginTop: '64px',
          marginLeft: sidebarOpen ? '200px' : '0',
          transition: 'margin-left 0.3s ease',
          padding: '20px',
        }}
      >
        {/* Routes */}
        <Routes>
          <Route
            path="/"
            element={
              <>
                <StockTerms onSelect={handleTermSelect} />
                {message && <Typography variant="h6" mt={2}>{message}</Typography>}
                <Typography variant="h5" align="center" mt={3}>
                  Welcome to Your Dashboard
                </Typography>
              </>
            }
          />
          <Route path="profile" element={<Profile />} />
          <Route path="stock" element={<StockData />} />
          <Route path="about" element={<AboutUs />} />
          <Route path="contact" element={<ContactUs />} />
          <Route path="logout" element={<Logout />} />
          <Route path="news" element={<News />} />
          <Route path="predict" element={<StockPredictionForm />} />
        </Routes>
      </Container>

      {/* Snackbar for Feedback */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="info" sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Dashboard;
