import React, { useEffect, useState } from 'react';
import { Container, Typography, CircularProgress, Box, TextField, Button } from '@mui/material';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({});

  useEffect(() => {
    // Fetch the token from localStorage
    const token = localStorage.getItem('token');

    if (!token) {
      setError('No token found, please log in');
      setLoading(false);
      return;
    }

    // Fetch user profile data
    fetch('http://localhost:4000/api/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,  // Correctly format the token
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error('Failed to fetch profile');
        return response.json();
      })
      .then((data) => {
        setProfile(data);
        setUpdatedProfile(data); // Initialize updatedProfile with the fetched data
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProfile({ ...updatedProfile, [name]: value });
  };

  const handleUpdateClick = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    // Call an API to save the updated profile data
    // For example:
    const token = localStorage.getItem('token');
    fetch('http://localhost:4000/api/profile/update', {
      method: 'PUT', // Assuming you have a PUT endpoint for updating
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedProfile),
    })
      .then((response) => {
        if (!response.ok) throw new Error('Failed to update profile');
        return response.json();
      })
      .then((data) => {
        setProfile(data); // Update profile with the new data
        setIsEditing(false); // Exit edit mode
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography variant="h6" color="error">{error}</Typography>;
  }

  return (
    <Container sx={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        User Profile
      </Typography>
      <Box component="form" noValidate autoComplete="off">
        <TextField
          label="Username"
          name="username"
          value={updatedProfile.username || ''}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          InputProps={{
            readOnly: !isEditing,
          }}
        />
        <TextField
          label="Email"
          name="email"
          value={updatedProfile.email || ''}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          InputProps={{
            readOnly: !isEditing,
          }}
        />
        {/* Uncomment these if your user model has these fields */}
        {/* <TextField
          label="First Name"
          name="firstName"
          value={updatedProfile.firstName || ''}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          InputProps={{
            readOnly: !isEditing,
          }}
        />
        <TextField
          label="Last Name"
          name="lastName"
          value={updatedProfile.lastName || ''}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          InputProps={{
            readOnly: !isEditing,
          }}
        />
        <TextField
          label="Joined Date"
          name="joined"
          value={updatedProfile.joined ? new Date(updatedProfile.joined).toLocaleDateString() : ''}
          fullWidth
          margin="normal"
          InputProps={{
            readOnly: true,
          }}
        /> */}
      </Box>
      <Button variant="contained" onClick={handleUpdateClick} sx={{ marginTop: '20px' }}>
        {isEditing ? 'Cancel' : 'Edit Profile'}
      </Button>
      {isEditing && (
        <Button variant="contained" color="primary" onClick={handleSave} sx={{ marginTop: '20px', marginLeft: '10px' }}>
          Save Changes
        </Button>
      )}
    </Container>
  );
};

export default Profile;
