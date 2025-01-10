import React, { useState } from 'react';
import { Box, Button, Card, CardContent, Typography, Grid, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import StockSuggestions from './StockSuggestions';

const StockPredictionForm = () => {
  const [ticker, setTicker] = useState('');
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const calculateDates = (term) => {
    const currentDate = new Date();
    let startDate, endDate;

    if (term === 'short-term') {
      startDate = new Date(currentDate.setMonth(currentDate.getMonth() - 7));
      endDate = new Date();
    } else if (term === 'mid-term') {
      startDate = new Date(currentDate.setMonth(currentDate.getMonth() - 12));
      endDate = new Date();
    } else if (term === 'long-term') {
      startDate = new Date(currentDate.setMonth(currentDate.getMonth() - 24));
      endDate = new Date();
    }

    return {
      start: startDate.toISOString().split('T')[0],
      end: endDate.toISOString().split('T')[0],
    };
  };

  const handleTermSelection = (term) => {
    setSelectedTerm(term);
    const { start, end } = calculateDates(term);
    console.log(`Selected Term: ${term}`, `Start Date: ${start}`, `End Date: ${end}`);
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

    const predictionData = {
      ticker,
      start,
      end,
      timeframe: selectedTerm,
    };

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(predictionData),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch prediction data');
      }

      const data = await response.json();
      setPredictionResult(data);
    } catch (err) {
      console.error('Error fetching prediction:', err);
      setError('An error occurred while fetching prediction data.');
    } finally {
      setLoading(false);
    }
  };

  const renderSpeedometer = (riskPercentage) => {
    const riskLevelColor =
      riskPercentage < 33 ? '#4caf50' : riskPercentage < 66 ? '#ff9800' : '#f44336';

    const needleTransform = `rotate(${riskPercentage * 1.8 - 90}deg)`;

    return (
      <Box sx={{ mt: 4, textAlign: 'center', position: 'relative' }}>
        <Typography variant="h6" gutterBottom>
          Risk Level
        </Typography>
        <Box
          sx={{
            position: 'relative',
            width: 200,
            height: 100,
            mx: 'auto',
            mt: 2,
          }}
        >
          <svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M 10 90 A 90 90 0 0 1 190 90"
              fill="none"
              stroke="#ddd"
              strokeWidth="10"
            />
            <path
              d="M 10 90 A 90 90 0 0 1 190 90"
              fill="none"
              stroke={riskLevelColor}
              strokeWidth="10"
              strokeDasharray={`${riskPercentage * 2.7} ${270 - riskPercentage * 2.7}`}
            />
            <line
              x1="100"
              y1="90"
              x2={100 + 80 * Math.cos((riskPercentage - 50) * (Math.PI / 50))}
              y2={90 - 80 * Math.sin((riskPercentage - 50) * (Math.PI / 50))}
              stroke="black"
              strokeWidth="3"
              transform={needleTransform}
              transformOrigin="100px 90px"
            />
            {/* Labels */}
            <text x="10" y="95" fill="#4caf50" fontSize="12" fontWeight="bold">
              Low Risk
            </text>
            <text x="160" y="95" fill="#f44336" fontSize="12" fontWeight="bold">
              High Risk
            </text>
            <text x="90" y="30" fill="#ff9800" fontSize="12" fontWeight="bold">
              Moderate
            </text>
          </svg>
        </Box>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
          Risk Percentage: {riskPercentage}%. A lower percentage indicates a safer investment,
          while higher values suggest higher volatility.
        </Typography>
      </Box>
    );
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 5, p: 3, boxShadow: 3, borderRadius: 2, bgcolor: 'linear-gradient(135deg, #f3f4f6, #e5e7eb)' }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ color: '#1e3a8a' }}>
        Stock Prediction Tool
      </Typography>
      <Typography variant="body1" gutterBottom sx={{ color: '#374151', textAlign: 'center' }}>
        This tool helps you predict the performance of a stock. Select a stock, choose an investment period, and view the results with detailed insights.
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
            {[
              {
                term: 'short-term',
                title: 'Short Term',
                description: 'Focuses on quick trends (7 months). Suitable for short-term gains but higher risk.',
              },
              {
                term: 'mid-term',
                title: 'Mid Term',
                description: 'Balances risk and returns (12 months). Good for medium-term trends.',
              },
              {
                term: 'long-term',
                title: 'Long Term',
                description: 'Stable investments (24 months). Ideal for long-term growth.',
              },
            ].map(({ term, title, description }) => (
              <Grid item xs={4} key={term}>
                <Tooltip
                  title={
                    <Box sx={{ p: 2, bgcolor: '#f9fafb', color: '#1f2937', borderRadius: 1, boxShadow: 3 }}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#111827' }}>{title}</Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>{description}</Typography>
                    </Box>
                  }
                  arrow
                >
                  <Card
                    onClick={() => handleTermSelection(term)}
                    sx={{
                      cursor: 'pointer',
                      border: selectedTerm === term ? '2px solid #2563eb' : '1px solid #d1d5db',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                      },
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" align="center" sx={{ color: '#111827' }}>
                        {title}
                      </Typography>
                    </CardContent>
                  </Card>
                </Tooltip>
              </Grid>
            ))}
          </Grid>
        </Box>
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ bgcolor: '#1d4ed8', '&:hover': { bgcolor: '#1e40af' } }}>
          {loading ? 'Loading...' : 'Predict'}
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={() => navigate('/past-predictions')}
        >
          View Past Predictions
        </Button>
      </form>

      {error && (
        <Typography variant="body1" color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      {predictionResult && (
        <Card sx={{ mt: 4, p: 3, boxShadow: 3, borderRadius: 2, bgcolor: 'white' }}>
          <Typography variant="h5" gutterBottom align="center" sx={{ color: '#1e3a8a' }}>
            Prediction Results
          </Typography>
          <Box sx={{ mt: 2, p: 2, border: '1px solid #d1d5db', borderRadius: 2 }}>
            <Typography variant="h6">Predicted Closing Price: ₹{predictionResult.predicted_closing_price}</Typography>
            <Typography variant="body2" color="textSecondary">
              This is the price the stock might reach based on historical trends.
            </Typography>
          </Box>
          <Box sx={{ mt: 2, p: 2, border: '1px solid #d1d5db', borderRadius: 2 }}>
            <Typography variant="h6">Threshold Price: ₹{predictionResult.threshold_price}</Typography>
            <Typography variant="body2" color="textSecondary">
              If the stock falls below this price, it may signal a high-risk zone.
            </Typography>
          </Box>
          {renderSpeedometer(predictionResult.risk_percentage)}
          <Typography variant="body2" align="center" sx={{ mt: 3, color:
 '#374151' }}>
            Based on the analysis, this stock has a <strong>{predictionResult.risk_percentage < 33 ? 'Low' : predictionResult.risk_percentage < 66 ? 'Moderate' : 'High'}</strong> risk level. Make informed decisions accordingly.
          </Typography>
        </Card>
      )}
    </Box>
  );
};

export default StockPredictionForm;
