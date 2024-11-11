import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null); // For handling errors
  const [loading, setLoading] = useState(false); // For handling loading state

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      
      return;
    }

    setLoading(true); // Start loading when submitting
    setError(null); // Clear previous errors

    const payload = {
      username,
      email,
      password,
    };

    try {
      const response = await fetch('http://localhost:4000/signup', { // Use the proxy here
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload), // Send the user details as JSON
      });

      const data = await response.json(); // Parse the response from the server

      if (response.ok) {
        console.log('Signup successful', data);
        // Optionally, redirect the user or show a success message
      } else {
        // If signup fails, display the error message from the server
        setError(data.message || 'Signup failed. Please try again.');
      }
    } catch (err) {
      // If there's an error with the request, display a general error message
      setError('Something went wrong. Please try again later.');
    } finally {
      setLoading(false); // Stop loading when the request is finished
    }
  };

  return (
    <Container maxWidth="xs" style={{ marginTop: '50px' }}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        style={{ marginTop: '20px' }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Signup
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <TextField
            label="Confirm Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {error && <Typography color="error" style={{ marginTop: '10px' }}>{error}</Typography>}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: '20px' }}
            disabled={loading} // Disable button when loading
          >
            {loading ? 'Signing up...' : 'Signup'}
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Signup;
