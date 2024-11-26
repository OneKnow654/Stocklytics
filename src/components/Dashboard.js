import React, { useState, useEffect } from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import { Container, IconButton, Box, Typography } from '@mui/material';
import StockData from './Stock';
import AboutUs from './Aboutus';
import ContactUs from './ContactUs';
import MenuIcon from '@mui/icons-material/Menu';
import Sidebar from './Sidebar';
import News from './News';
import Profile from './Profile';
import StockPredictionForm from './predict'; // Import the StockPredictionForm component

// Logout Component
const Logout = () => {
  return <Typography variant="h5">Logout Page</Typography>;
};

// Stock Terms Component
const StockTerms = ({ onSelect }) => {
  const terms = [
    { label: 'Short', color: '#FF5733' }, // Red for "Short"
    { label: 'Long', color: '#28A745' },  // Green for "Long"
    { label: 'Hold', color: '#FFC107' }   // Yellow for "Hold"
  ];

  return (
    <Box display="flex" justifyContent="space-around" mb={2}>
      {terms.map(term => (
        <Box
          key={term.label}
          onClick={() => onSelect(term.label)}
          sx={{
            backgroundColor: term.color,
            color: '#FFFFFF', // Text color
            borderRadius: '8px',
            padding: '24px', // Increased padding for larger size
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
            width: '120px', // Fixed width for uniformity
            '&:hover': { opacity: 0.8 }, // Change opacity on hover
          }}
        >
          <Typography variant="h6">{term.label}</Typography>
        </Box>
      ))}
    </Box>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');

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
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Toggle Button */}
      <IconButton onClick={toggleSidebar} sx={{ position: 'absolute', left: '10px', top: '10px', zIndex: '10' }}>
        <MenuIcon sx={{ color: '#333' }} />
      </IconButton>

      {/* Sidebar */}
      <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} username={username} />

      {/* Content Area */}
      <Container sx={{ marginLeft: '200px', padding: '20px', transition: 'margin-left 0.3s ease', marginLeft: sidebarOpen ? '200px' : '0' }}>
        {/* Routes */}
        <Routes>
          <Route path="/" element={
            <>
              <StockTerms onSelect={handleTermSelect} />
              {message && <Typography variant="h6" mt={2}>{message}</Typography>}
              <Typography variant="h5">Welcome to the Dashboard</Typography>
            </>
          } />
          <Route path="profile" element={<Profile />} />
          <Route path="stock" element={<StockData />} />
          <Route path="about" element={<AboutUs />} />
          <Route path="contact" element={<ContactUs />} />
          <Route path="logout" element={<Logout />} />
          <Route path="news" element={<News />} />
          <Route path="predict" element={<StockPredictionForm />} /> {/* Add Prediction Form Route */}
        </Routes>
      </Container>
    </Box>
  );
};

export default Dashboard;
