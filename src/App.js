import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import Homepage from './components/Homepage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status

  const handleLogout = () => {
    setIsLoggedIn(false);
    // Clear any authentication tokens here if implemented
  };

  return (
    <Router>
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: 'rgba(0, 123, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          boxShadow: 'none',
        }}
      >
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, color: '#fff' }}>
            My App
          </Typography>

          {!isLoggedIn ? (
            <>
              <Button color="inherit" component={Link} to="/login" sx={{ color: '#fff' }}>
                Login
              </Button>
              <Button color="inherit" component={Link} to="/signup" sx={{ color: '#fff' }}>
                Signup
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/dashboard" sx={{ color: '#fff' }}>
                Dashboard
              </Button>
              <Button color="inherit" onClick={handleLogout} sx={{ color: '#fff' }}>
                Logout
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ paddingTop: '80px' }}>
        <Container>
          <Routes>
            <Route path="/" element={< input type='e' />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard/*" element={<Dashboard />} />
            <Route
              path="*"
              element={
                <Box textAlign="center" mt={4}>
                  <Typography variant="h5" color="error">
                    404 - Page Not Found
                  </Typography>
                  <Button variant="contained" color="primary" component={Link} to="/">
                    Go Home
                  </Button>
                </Box>
              }
            />
          </Routes>
        </Container>
      </Box>
    </Router>
  );
}

export default App;
