import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardContent } from '@mui/material';

const MarketOverview = () => {
  const [marketOverview, setMarketOverview] = useState({});
  const [watchlist, setWatchlist] = useState([
    { symbol: 'RELIANCE', price: 2500, change: '+0.5%' },
    { symbol: 'TCS', price: 3450, change: '+1.2%' },
    { symbol: 'TATASTEEL', price: 125.2, change: '-0.89%' }
  ]);
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await fetch('https://api.example.com/market-overview');
        const data = await response.json();
        setMarketOverview(data);
      } catch (error) {
        console.error('Error fetching market overview:', error);
      }
    };

    const fetchNews = async () => {
      try {
        const response = await fetch('https://api.example.com/stock-news');
        const data = await response.json();
        setNews(data.slice(0, 5));
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };

    fetchMarketData();
    fetchNews();
  }, []);

  return (
    <Container>
      {/* Market Overview */}
      <Typography variant="h5" sx={{ mb: 2 }}>📊 Market Overview</Typography>
      <Card sx={{ mb: 3, p: 2, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6">NIFTY 50: {marketOverview.nifty || 'Loading...'}</Typography>
          <Typography variant="h6">Sensex: {marketOverview.sensex || 'Loading...'}</Typography>
        </CardContent>
      </Card>

      {/* Watchlist */}
      <Typography variant="h5" sx={{ mb: 2 }}>📋 Watchlist</Typography>
      <Grid container spacing={3}>
        {watchlist.map((stock, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card sx={{ mb: 2, p: 2, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6">{stock.symbol}</Typography>
                <Typography variant="body2">Price: ₹{stock.price}</Typography>
                <Typography variant="body2" sx={{ color: stock.change.includes('+') ? 'green' : 'red' }}>
                  Change: {stock.change}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      
    </Container>
  );
};

export default MarketOverview;
