import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const AboutUs = () => {
  return (
    <Container sx={{ padding: '20px' }}>
      <Typography variant="h3" gutterBottom>
        About Us
      </Typography>
      <Box sx={{ marginBottom: '20px' }}>
        <Typography variant="body1" paragraph>
          Welcome to our Stock Market Prediction platform! Our goal is to provide you with cutting-edge insights and
          tools to help you make informed decisions in the stock market. We leverage advanced algorithms, machine learning,
          and data analytics to offer predictive analysis of market trends and stock movements.
        </Typography>
        <Typography variant="body1" paragraph>
          Our platform is designed to assist both seasoned investors and newcomers. Whether you are looking to invest for the long-term or day trade, our prediction tools provide real-time data and forecasts, helping you navigate the complexities of the stock market.
        </Typography>
        <Typography variant="body1" paragraph>
          At the core of our technology are sophisticated models that analyze historical data, news events, and technical indicators to predict potential market movements. We strive to give our users the most accurate and up-to-date information available.
        </Typography>
        <Typography variant="body1" paragraph>
          Join us on this exciting journey to maximize your investment potential with data-driven insights!
        </Typography>
      </Box>
      <Typography variant="h6">
        Our Mission
      </Typography>
      <Typography variant="body1" paragraph>
        Our mission is to empower investors with reliable data and tools, ensuring they can make confident investment decisions in the fast-paced world of stock trading.
      </Typography>
    </Container>
  );
};

export default AboutUs;
