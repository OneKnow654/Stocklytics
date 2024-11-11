import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Alert } from '@mui/material';

const ContactUs = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    console.log('Form submitted:', formData);
    setSubmitted(true);

    // Clear the form
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <Container sx={{ padding: '20px' }}>
      <Typography variant="h3" gutterBottom>
        Contact Us
      </Typography>
      {submitted && <Alert severity="success">Thank you! Your message has been sent.</Alert>}
      <Box component="form" onSubmit={handleSubmit} sx={{ marginTop: '20px' }}>
        <TextField
          fullWidth
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          multiline
          rows={4}
          margin="normal"
          required
        />
        <Button type="submit" variant="contained" color="primary" sx={{ marginTop: '20px' }}>
          Send Message
        </Button>
      </Box>
    </Container>
  );
};

export default ContactUs;
