import React from 'react';
import { Box, List, ListItem, ListItemText, IconButton, Typography, Card, CardContent, Divider, Tooltip } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import InsightsIcon from '@mui/icons-material/Insights';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import InfoIcon from '@mui/icons-material/Info';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link } from 'react-router-dom';

const menuItems = [
  { label: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { label: 'Profile', icon: <AccountCircleIcon />, path: 'profile' },
  { label: 'Stock', icon: <InsightsIcon />, path: 'stock' },
  { label: 'News', icon: <NewspaperIcon />, path: 'news' },
  { label: 'About Us', icon: <InfoIcon />, path: 'about' },
  { label: 'Contact Us', icon: <ContactMailIcon />, path: 'contact' },
  { label: 'Stock Predict', icon: <InsightsIcon />, path: 'predict' },
  { label: 'Logout', icon: <LogoutIcon />, path: 'logout' },
];

// Redesigned Sidebar Component
const Sidebar = ({ open, toggleSidebar, username }) => {
  return (
    <Box
      sx={{
        width: '240px',
        height: '100vh',
        backgroundColor: '#1E293B',
        color: '#FFFFFF',
        position: 'fixed',
        left: open ? '0' : '-240px',
        transition: 'left 0.3s ease',
        boxShadow: open ? '2px 0 8px rgba(0,0,0,0.5)' : 'none',
      }}
    >
      {/* Sidebar Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', padding: '16px', backgroundColor: '#334155' }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          {username ? `Hi, ${username}` : 'Welcome!'}
        </Typography>
        <IconButton onClick={toggleSidebar} sx={{ color: '#FFFFFF' }}>
          <ChevronLeftIcon />
        </IconButton>
      </Box>

      {/* Navigation Menu */}
      <List>
        {menuItems.map((item) => (
          <Tooltip key={item.label} title={item.label} arrow placement="right">
            <ListItem
              button
              component={Link}
              to={item.path}
              sx={{
                '&:hover': {
                  backgroundColor: '#475569',
                },
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Box sx={{ marginRight: '16px', color: '#94A3B8' }}>{item.icon}</Box>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  sx: { fontWeight: 'bold', color: '#E2E8F0' },
                }}
              />
            </ListItem>
          </Tooltip>
        ))}
      </List>

      <Divider sx={{ margin: '16px 0', backgroundColor: '#475569' }} />

      {/* Footer */}
      <Card sx={{ margin: '16px', backgroundColor: '#475569' }}>
        <CardContent>
          <Typography variant="body2" align="center" sx={{ color: '#E2E8F0' }}>
            Sidebar Navigation
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Sidebar;
