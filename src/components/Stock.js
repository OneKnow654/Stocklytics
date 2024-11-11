import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, CircularProgress, Box, Grid, Button, MenuItem } from '@mui/material';
import { Autocomplete } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';

Chart.register(...registerables);

const StockData = () => {
  const [symbol, setSymbol] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [stockInfo, setStockInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingSuggestions, setFetchingSuggestions] = useState(false);
  const [chartData, setChartData] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [chartLabels, setChartLabels] = useState([]);
  const [historicalRange, setHistoricalRange] = useState('1d');
  const [indicator, setIndicator] = useState('None'); // State to store selected indicator
  const chartRef = useRef(null);

  const fetchStockData = async (selectedSymbol) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:4000/stock/${selectedSymbol}`);
      const data = response.data;

      if (data.price) {
        const chartLabels = [new Date(data.price.regularMarketTime).toLocaleString()];
        const chartPrices = [data.price.regularMarketPrice];

        setChartData({
          labels: chartLabels,
          datasets: [
            {
              label: `${selectedSymbol} Stock Price`,
              data: chartPrices,
              fill: false,
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              tension: 0.1,
            },
          ],
        });
        setStockInfo(data);
        setHistoricalData(chartPrices);
        setChartLabels(chartLabels);
      } else {
        throw new Error("Price data not available");
      }
    } catch (error) {
      console.error('Error fetching stock data:', error);
      alert('Error fetching stock data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:4000/stocks');
  
    socket.onmessage = (event) => {
      const newData = JSON.parse(event.data);
      if (newData.symbol === symbol) {  // Ensure you're updating the right stock chart
        updateChartData(newData);
      }
    };
  
    return () => {
      socket.close();
    };
  }, [symbol]);  // Dependency on 'symbol' ensures it updates the right stock data
  

  const updateChartData = (newData) => {
    const newPrice = newData.price;
    const newTimestamp = new Date(newData.timestamp).toLocaleTimeString(); // Format as time
  
    setHistoricalData((prev) => [...prev, newPrice]);
    setChartLabels((prev) => [...prev, newTimestamp]);
  
    setChartData((prevData) => ({
      ...prevData,
      labels: [...prevData.labels, newTimestamp],
      datasets: [
        {
          ...prevData.datasets[0],
          data: [...prevData.datasets[0].data, newPrice],
        },
      ],
    }));
  };
  
  const fetchSuggestions = async (inputValue) => {
    if (!inputValue) {
      setSuggestions([]);
      return;
    }
    setFetchingSuggestions(true);
    try {
      const response = await axios.get(`http://localhost:4000/suggestions/${inputValue}`);
      setSuggestions(response.data);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setFetchingSuggestions(false);
    }
  };

  const handleSymbolChange = (event, value) => {
    if (value) {
      setSymbol(value);
      fetchStockData(value);
    }
  };

  const getHistoricalDates = (range) => {
    const now = new Date();
    let startDate;
    switch (range) {
      case '1d':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 1);
        break;
      case '1w':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case '1m':
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
        break;
      case '1y':
        startDate = new Date(now);
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate = new Date(now);
    }
    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: now.toISOString().split('T')[0],
    };
  };
  
  const fetchHistoricalData = async () => {
    const { startDate, endDate } = getHistoricalDates(historicalRange);
  
    try {
      const response = await axios.get(`http://localhost:4000/historical/${symbol}?startDate=${startDate}&endDate=${endDate}`);
      const historicalData = response.data.data;
  
      const historicalPrices = historicalData.map(item => item.close); // Assuming 'close' prices
      const historicalLabels = historicalData.map(item => item.date);  // Assuming 'date' format
  
      setHistoricalData(historicalPrices);
      setChartLabels(historicalLabels);
  
      setChartData({
        labels: historicalLabels,
        datasets: [
          {
            label: `${symbol} Historical Stock Prices`,
            data: historicalPrices,
            fill: false,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            tension: 0.1,
          },
        ],
      });
    } catch (error) {
      console.error('Error fetching historical data:', error);
    }
  };

  const applyIndicator = (data, indicatorType) => {
    switch (indicatorType) {
      case 'MA':
        return calculateMovingAverage(data);
      case 'EMA':
        return calculateExponentialMovingAverage(data);
      default:
        return null;
    }
  };

  // Calculate Moving Average (MA)
  const calculateMovingAverage = (data, period = 5) => {
    let result = [];
    for (let i = 0; i < data.length; i++) {
      const window = data.slice(Math.max(0, i - period + 1), i + 1);
      const avg = window.reduce((sum, val) => sum + val, 0) / window.length;
      result.push(avg);
    }
    return result;
  };

  // Calculate Exponential Moving Average (EMA)
  const calculateExponentialMovingAverage = (data, period = 5) => {
    let ema = [];
    const k = 2 / (period + 1);
    ema[0] = data[0]; // Start EMA at the first data point
    for (let i = 1; i < data.length; i++) {
      ema[i] = data[i] * k + ema[i - 1] * (1 - k);
    }
    return ema;
  };

  const handleIndicatorChange = (e) => {
    const selectedIndicator = e.target.value;
    setIndicator(selectedIndicator);

    if (selectedIndicator !== 'None') {
      const calculatedData = applyIndicator(historicalData, selectedIndicator);
      if (calculatedData) {
        setChartData((prevData) => ({
          ...prevData,
          datasets: [
            ...prevData.datasets,
            {
              label: `${symbol} ${selectedIndicator}`,
              data: calculatedData,
              fill: false,
              backgroundColor: 'rgba(255, 99, 132, 0.6)',
              borderColor: 'rgba(255, 99, 132, 1)',
              tension: 0.1,
            },
          ],
        }));
      }
    }
  };

  const formatMarketCap = (marketCap) => {
    if (marketCap >= 1e12) return `${(marketCap / 1e12).toFixed(2)} Trillion ₹`;
    if (marketCap >= 1e9) return `${(marketCap / 1e9).toFixed(2)} Billion ₹`;
    if (marketCap >= 1e7) return `${(marketCap / 1e7).toFixed(2)} Crore ₹`;
    return `${marketCap} ₹`;
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Stock Market Data
      </Typography>
  
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item xs={12} sm={8}>
          {/* Autocomplete for stock symbol search */}
          <Autocomplete
            freeSolo
            options={suggestions}
            getOptionLabel={(option) => option}
            onInputChange={(e, newInputValue) => fetchSuggestions(newInputValue)}
            onChange={handleSymbolChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search Stock Symbol"
                variant="outlined"
                fullWidth
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {fetchingSuggestions ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        </Grid>
  
        {/* Dropdown for selecting technical indicator at top-right */}
        <Grid item xs={12} sm={4} style={{ textAlign: 'right', marginTop: '16px' }}>
          <TextField
            select
            label="Select Technical Indicator"
            value={indicator}
            onChange={handleIndicatorChange}
            sx={{ width: '100%', maxWidth: '250px',marginBottom :"17px" }}  // Ensures the dropdown fits at top-right
          >
            <MenuItem value="None">None</MenuItem>
            <MenuItem value="MA">Moving Average (MA)</MenuItem>
            <MenuItem value="EMA">Exponential Moving Average (EMA)</MenuItem>
          </TextField>
        </Grid>
      </Grid>
  
      {/* Dropdown for selecting historical data range */}
      <Box sx={{ marginTop: '20px' }}>
        <TextField
          select
          label="Select Historical Data Range"
          value={historicalRange}
          onChange={(e) => setHistoricalRange(e.target.value)}
          fullWidth
        >
          <MenuItem value="1d">1 Day</MenuItem>
          <MenuItem value="1w">1 Week</MenuItem>
          <MenuItem value="1m">1 Month</MenuItem>
          <MenuItem value="1y">1 Year</MenuItem>
        </TextField>
      </Box>
            
         {/* Button for fetching historical data */}
         <Button
                  onClick={fetchHistoricalData}
                  variant="contained"
                  color="primary"
                  sx={{ marginTop: '20px' }}
                >
                  View Historical Data
                </Button>
      {loading ? (
        <CircularProgress style={{ marginTop: '20px' }} />
      ) : (
        stockInfo && (
          <div style={{ marginTop: '20px' }}>
            {chartData && (
              <div style={{ marginTop: '40px' }}>
                <Typography variant="h6">Stock Price Chart:</Typography>
                <Line
                  data={chartData}
                  options={{
                    scales: {
                      x: {
                        type: 'time',
                        time: {
                          unit: 'minute',
                        },
                      },
                      y: {
                        beginAtZero: false,
                      },
                    },
                  }}
                />
              </div>
            )}
  
            {stockInfo && (
              <Box sx={{ marginTop: '20px' }}>
                <Typography variant="h6">Stock Information:</Typography>
  
                <Grid container spacing={2} sx={{ marginTop: '20px' }}>
                  <Grid item xs={6} md={4}>
                    <Box
                      sx={{
                        padding: 2,
                        backgroundImage: 'linear-gradient(135deg, #69FF97 10%, #00E4FF 100%)',
                        borderRadius: '8px',
                      }}
                    >
                      <Typography variant="body1" color="textSecondary">
                        Current Price
                      </Typography>
                      <Typography variant="h6">₹{stockInfo.price.regularMarketPrice}</Typography>
                    </Box>
                  </Grid>
  
                  <Grid item xs={6} md={4}>
                    <Box
                      sx={{
                        padding: 2,
                        backgroundImage: 'linear-gradient(135deg, #69FF97 10%, #00E4FF 100%)',
                        borderRadius: '8px',
                      }}
                    >
                      <Typography variant="body1" color="textSecondary">
                        Open Price
                      </Typography>
                      <Typography variant="h6">₹{stockInfo.price.regularMarketOpen}</Typography>
                    </Box>
                  </Grid>
  
                  <Grid item xs={6} md={4}>
                    <Box
                      sx={{
                        padding: 2,
                        backgroundImage: 'linear-gradient(135deg, #69FF97 10%, #00E4FF 100%)',
                        borderRadius: '8px',
                      }}
                    >
                      <Typography variant="body1" color="textSecondary">
                        Day High
                      </Typography>
                      <Typography variant="h6">₹{stockInfo.price.regularMarketDayHigh}</Typography>
                    </Box>
                  </Grid>
  
                  <Grid item xs={6} md={4}>
                    <Box
                      sx={{
                        padding: 2,
                        backgroundImage: 'linear-gradient(135deg, #69FF97 10%, #00E4FF 100%)',
                        borderRadius: '8px',
                      }}
                    >
                      <Typography variant="body1" color="textSecondary">
                        Day Low
                      </Typography>
                      <Typography variant="h6">₹{stockInfo.price.regularMarketDayLow}</Typography>
                    </Box>
                  </Grid>
  
                  <Grid item xs={6} md={4}>
                    <Box
                      sx={{
                        padding: 2,
                        backgroundImage: 'linear-gradient(135deg, #69FF97 10%, #00E4FF 100%)',
                        borderRadius: '8px',
                      }}
                    >
                      <Typography variant="body1" color="textSecondary">
                        Market Cap
                      </Typography>
                      <Typography variant="h6">{formatMarketCap(stockInfo.price.marketCap)}</Typography>
                    </Box>
                  </Grid>
                </Grid>
  
             
              </Box>
            )}
          </div>
        )
      )}
    </Container>
  );
  
};

export default StockData;
