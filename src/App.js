import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <Router>
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
          <Button color="inherit" component={Link} to="/login" sx={{ color: '#fff' }}>
            Login
          </Button>
          <Button color="inherit" component={Link} to="/signup" sx={{ color: '#fff' }}>
            Signup
          </Button>
         
        </Toolbar>
      </AppBar>

      <Box sx={{ paddingTop: '80px' }}>
        <Container>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            <Route path="/dashboard/*" element={<Dashboard />} />
          </Routes>
        </Container>
      </Box>
    </Router>
  );
}

export default App;
