import React, { useState } from 'react';
import { Box, Button, Card, CardContent, Typography, Grid, Tooltip, MenuItem, TextField } from '@mui/material';
import ReactECharts from 'echarts-for-react';
import { useNavigate } from 'react-router-dom';
import StockSuggestions from './StockSuggestions';

const StockPredictionForm = () => {
  const [ticker, setTicker] = useState('');
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [realStockData, setRealStockData] = useState([]);
  const [predictedStockData, setPredictedStockData] = useState([]);
  const [chartType, setChartType] = useState('line'); // Default chart type
  const navigate = useNavigate();

  const calculateDates = (term) => {
    const currentDate = new Date();
    let startDate, endDate;

    if (term === 'short-term') {
      startDate = new Date(currentDate.setMonth(currentDate.getMonth() - 7));
    } else if (term === 'mid-term') {
      startDate = new Date(currentDate.setMonth(currentDate.getMonth() - 12));
    } else if (term === 'long-term') {
      startDate = new Date(currentDate.setMonth(currentDate.getMonth() - 24));
    }

    endDate = new Date();
    return {
      start: startDate.toISOString().split('T')[0],
      end: endDate.toISOString().split('T')[0],
    };
  };

  const handleTermSelection = (term) => {
    setSelectedTerm(term);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!ticker) {
      setError('Please select a stock.');
      return;
    }

    if (!selectedTerm) {
      setError('Please select an investment period.');
      return;
    }

    const { start, end } = calculateDates(selectedTerm);

    try {
      setLoading(true);
      setError('');

      const predictionResponse = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker, start, end, timeframe: selectedTerm }),
      });

      if (!predictionResponse.ok) throw new Error('Failed to fetch prediction data');
      const predictionData = await predictionResponse.json();
      setPredictionResult(predictionData);

      const historicalResponse = await fetch(`http://localhost:5000/data?ticker=${ticker}&start=${start}&end=${end}`);
      if (!historicalResponse.ok) throw new Error('Failed to fetch historical data');

      const historicalData = await historicalResponse.json();
      const realData = historicalData.map((item) => ({
        date: new Date(item.Date).toLocaleDateString(), // Format for x-axis
        open: item.Open,
        high: item.High,
        low: item.Low,
        close: item.Close,
        price: item.Close,
      }));

      setRealStockData(realData);

      const predictedData = realData.map((point) => ({
        date: point.date,
        price: predictionData.predicted_closing_price,
      }));
      setPredictedStockData(predictedData);
    } catch (err) {
      console.error(err);
      setError('An error occurred while fetching data.');
    } finally {
      setLoading(false);
    }
  };

  const getChartOptions = () => ({
    title: { text: 'Stock Price Comparison', left: 'center' },
    tooltip: {
      trigger: 'axis',
      formatter: (params) => {
        const [real, predicted] = params;
        return `
          <b>${real.axisValueLabel}</b><br/>
          Real Closed Price: ₹${real.data}<br/>
          Predicted Closed Price: ₹${predicted?.data || 'N/A'}
        `;
      },
    },
    legend: {
      data: ['Real Price', 'Predicted Price'],
      bottom: '5%',
      itemGap: 15,
      textStyle: { fontSize: 12 },
    },
    xAxis: {
      type: 'category',
      data: realStockData.map((point) => point.date),
      boundaryGap: chartType === 'bar',
      axisLabel: {
        rotate: 45,
        interval: realStockData.length > 30 ? Math.floor(realStockData.length / 10) : 0, // Adjust for large datasets
        formatter: (value) => value.slice(0, 10), // Trim date labels for readability
      },
    },
    yAxis: {
      type: 'value',
      axisLabel: { formatter: '₹{value}' },
    },
    dataZoom: [
      { type: 'slider', xAxisIndex: 0, start: 0, end: 100 }, // Horizontal slider
      { type: 'inside', xAxisIndex: 0 }, // Drag zoom
    ],
    series: [
      {
        name: 'Real Price',
        type: chartType,
        data: realStockData.map((point) => point.price),
        smooth: chartType === 'line',
        lineStyle: { color: '#4caf50' },
      },
      {
        name: 'Predicted Price',
        type: chartType === 'candlestick' ? 'line' : chartType,
        data: predictedStockData.map((point) => point.price),
        smooth: chartType === 'line',
        lineStyle: { color: '#f44336' },
      },
    ],
  });

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 5, p: 3, boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ color: '#1e3a8a' }}>
        Stock Prediction Tool
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box sx={{ mb: 3 }}>
          <StockSuggestions onSelect={setTicker} />
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1, color: '#1e40af' }}>
            Select Investment Period:
          </Typography>
          <Grid container spacing={2}>
            {['short-term', 'mid-term', 'long-term'].map((term) => (
              <Grid item xs={4} key={term}>
                <Tooltip title={`Select ${term}`} arrow>
                  <Card
                    onClick={() => handleTermSelection(term)}
                    sx={{
                      cursor: 'pointer',
                      border: selectedTerm === term ? '2px solid #2563eb' : '1px solid #d1d5db',
                      '&:hover': { transform: 'scale(1.05)' },
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" align="center" sx={{ color: '#111827' }}>
                        {term.toUpperCase()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Tooltip>
              </Grid>
            ))}
          </Grid>
        </Box>
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ bgcolor: '#1d4ed8', '&:hover': { bgcolor: '#1e40af' } }}
        >
          {loading ? 'Loading...' : 'Predict'}
        </Button>
      </form>

      {error && (
        <Typography variant="body1" color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      {realStockData.length > 0 && predictedStockData.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <TextField
            select
            label="Select Chart Type"
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            fullWidth
            sx={{ mb: 3 }}
          >
            <MenuItem value="line">Line Chart</MenuItem>
            <MenuItem value="bar">Bar Chart</MenuItem>
            
          </TextField>
          <ReactECharts option={getChartOptions()} style={{ height: 400, width: '100%' }} />
        </Box>
      )}
    </Box>
  );
};

export default StockPredictionForm;
