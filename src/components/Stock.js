import React, { useState } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  TextField,
  CircularProgress,
  Box,
  Grid,
  Button,
  MenuItem,
  Card,
  CardContent,
  CardHeader,
} from '@mui/material';
import { Autocomplete } from '@mui/material';
import ReactECharts from 'echarts-for-react';

const StockData = () => {
  const [symbol, setSymbol] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [stockInfo, setStockInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingSuggestions, setFetchingSuggestions] = useState(false);
  const [chartLabels, setChartLabels] = useState([]);
  const [historicalData, setHistoricalData] = useState([]);
  const [historicalRange, setHistoricalRange] = useState('1d');

  // ======================
  // 1. Fetch Basic Stock Data
  // ======================
  const fetchStockData = async (selectedSymbol) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:4000/stock/${selectedSymbol}`);
      const data = response.data;

      if (data.price) {
        setStockInfo(data);
      } else {
        throw new Error('Price data not available');
      }
    } catch (error) {
      console.error('Error fetching stock data:', error);
      alert('Error fetching stock data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // 2. Fetch Symbol Suggestions
  // ======================
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

  // ======================
  // 3. Fetch Historical Data
  // ======================
  const fetchHistoricalData = async () => {
    if (!symbol) return;

    // Compute the start date based on historicalRange
    const now = new Date();
    let startDate = new Date(now);
    switch (historicalRange) {
      case '1d':
        startDate.setDate(now.getDate() - 1);
        break;
      case '1w':
        startDate.setDate(now.getDate() - 7);
        break;
      case '1m':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        // Fallback to 1 day
        startDate.setDate(now.getDate() - 1);
    }

    try {
      const response = await axios.get(
        `http://localhost:4000/historical/${symbol}?startDate=${startDate.toISOString().split('T')[0]}`
      );
      const historicalData = response.data.data; // Make sure your API returns { data: [...] }

      const prices = historicalData.map((item) => item.close);
      const labels = historicalData.map((item) => item.date);

      setHistoricalData(prices);
      setChartLabels(labels);
    } catch (error) {
      console.error('Error fetching historical data:', error);
    }
  };

  // ======================
  // 4. Chart Configuration
  // ======================
  const getChartOptions = () => {
    return {
      title: {
        text: `${symbol} Stock Price`,
        left: 'center',
      },
      tooltip: {
        trigger: 'axis',
      },
      // Allow zoom and pan
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 100,
        },
        {
          type: 'slider',
          start: 0,
          end: 100,
        },
      ],
      // Toolbox with various features (save as image, restore, data view)
      toolbox: {
        feature: {
          saveAsImage: { show: true },
          restore: { show: true },
          dataView: { show: true, readOnly: false },
        },
      },
      xAxis: {
        type: 'category',
        data: chartLabels,
        boundaryGap: false,
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '₹{value}',
        },
      },
      // Enable animations for a smoother load
      animation: true,
      animationEasing: 'cubicOut',
      animationDuration: 1000,
      series: [
        {
          name: 'Stock Price',
          type: 'line',
          data: historicalData,
          smooth: true,
          // Gradient fill under the line
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(76, 175, 80, 0.7)' }, // top color
                { offset: 1, color: 'rgba(76, 175, 80, 0)' },  // bottom color
              ],
            },
          },
          lineStyle: {
            color: '#4caf50',
          },
        },
      ],
    };
  };

  // ======================
  // 5. Handlers
  // ======================
  const handleSymbolChange = (event, value) => {
    if (value) {
      setSymbol(value);
      fetchStockData(value);
    }
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Stock Market Data
      </Typography>

      <Grid container spacing={2} alignItems="center">
        {/* Symbol Autocomplete */}
        <Grid item xs={12} sm={8}>
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

        {/* Historical Range Selector */}
        <Grid item xs={12} sm={4}>
          <TextField
            select
            label="Historical Data Range"
            value={historicalRange}
            onChange={(e) => setHistoricalRange(e.target.value)}
            fullWidth
          >
            <MenuItem value="1d">1 Day</MenuItem>
            <MenuItem value="1w">1 Week</MenuItem>
            <MenuItem value="1m">1 Month</MenuItem>
            <MenuItem value="1y">1 Year</MenuItem>
          </TextField>
        </Grid>
      </Grid>

      {/* Fetch Historical Data Button */}
      <Button
        onClick={fetchHistoricalData}
        variant="contained"
        color="primary"
        sx={{ marginTop: 2 }}
        disabled={!symbol}
      >
        {loading ? 'Loading...' : 'Fetch Historical Data'}
      </Button>

      {/* Chart Section */}
      {chartLabels.length > 0 && historicalData.length > 0 && (
        <Box sx={{ marginTop: 4 }}>
          <ReactECharts option={getChartOptions()} style={{ height: 400, width: '100%' }} />
        </Box>
      )}

      {/* Stock Information in Cards */}
      {stockInfo && (
        <Box sx={{ marginTop: 4 }}>
          <Typography variant="h6" gutterBottom>
            Stock Information:
          </Typography>
          <Grid container spacing={2}>
            {/* Current Price Card */}
            <Grid item xs={12} sm={4}>
              <Card>
                <CardHeader title="Current Price" />
                <CardContent>
                  <Typography variant="h5">
                    ₹{stockInfo.price.regularMarketPrice?.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Open Price Card */}
            <Grid item xs={12} sm={4}>
              <Card>
                <CardHeader title="Open Price" />
                <CardContent>
                  <Typography variant="h5">
                    ₹{stockInfo.price.regularMarketOpen?.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Market Cap Card */}
            <Grid item xs={12} sm={4}>
              <Card>
                <CardHeader title="Market Cap" />
                <CardContent>
                  <Typography variant="h5">
                    ₹{stockInfo.price.marketCap?.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}
    </Container>
  );
};

export default StockData;
