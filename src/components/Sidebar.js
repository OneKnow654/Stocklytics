import React, { useState, useEffect } from 'react'; // Import useEffect for fetching user data
import { Box, List, ListItem, ListItemText, IconButton, Typography, Card, CardContent } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { Link } from 'react-router-dom';

// Sidebar Component
const Sidebar = ({ open, toggleSidebar, username }) => {
  return (
    <Box
      sx={{
        width: '200px',
        height: '100vh',
        backgroundColor: '#333',
        color: '#fff',
        position: 'fixed',
        left: open ? '0' : '-200px',
        transition: 'left 0.3s ease',
      }}
    >
      <IconButton onClick={toggleSidebar} sx={{ color: '#fff' }}>
        <ChevronLeftIcon />
      </IconButton>

      {/* Name Card */}
      <Card sx={{ margin: '5px' }}>
        <CardContent>
          <Typography variant="h6" align="center">Welcome, {username || 'User'}!</Typography>
        </CardContent>
      </Card>

      <List component="nav">
        <ListItem button component={Link} to="profile">
          <ListItemText primary="Profile" sx={{ color: '#fff' }} />
        </ListItem>
        <ListItem button component={Link} to="stock">
          <ListItemText primary="Stock" sx={{ color: '#fff' }} />
        </ListItem>
        <ListItem button component={Link} to="news">
          <ListItemText primary="News" sx={{ color: '#fff' }} />
        </ListItem>
        <ListItem button component={Link} to="about">
          <ListItemText primary="About Us" sx={{ color: '#fff' }} />
        </ListItem>
        <ListItem button component={Link} to="contact">
          <ListItemText primary="Contact Us" sx={{ color: '#fff' }} />
        </ListItem>
        <ListItem button component={Link} to="logout">
          <ListItemText primary="Logout" sx={{ color: '#fff' }} />
        </ListItem>
      </List>
    </Box>
  );
};

export default Sidebar;
