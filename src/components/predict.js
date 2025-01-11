import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Card, CardContent, Typography, Grid, Tooltip } from '@mui/material';
import StockSuggestions from './StockSuggestions';

const StockPredictionForm = () => {
    const [ticker, setTicker] = useState('');
    const [selectedTerm, setSelectedTerm] = useState(null);
    const [predictionResult, setPredictionResult] = useState(null);
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

        if (!selectedTerm) {
            setError('Please select a term before submitting.');
            return;
        }

        const { start, end } = calculateDates(selectedTerm);

        const predictionData = {
            ticker,
            start,
            end,
            timeframe: selectedTerm,
        };

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
            setError(''); // Clear any previous error
        } catch (err) {
            console.error('Error fetching prediction:', err);
            setError('An error occurred while fetching prediction data.');
        }
    };

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', mt: 5, p: 3, boxShadow: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
            <Typography variant="h5" gutterBottom>
                Stock Prediction Form
            </Typography>
            <form onSubmit={handleSubmit}>
                <Box sx={{ mb: 3 }}>
                    <StockSuggestions onSelect={setTicker} />
                </Box>
                <Box sx={{ mb: 2 }}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                        Select Timeframe:
                    </Typography>
                    <Grid container spacing={2}>
                        {[{
                            term: 'short-term',
                            title: 'Short Term',
                            description: 'The short-term timeframe focuses on the last 7 months of data, ideal for identifying quick trends and short-lived price movements. It is suitable for traders seeking immediate returns but comes with higher risks due to market volatility and the need for frequent monitoring.',
                        },
                        {
                            term: 'mid-term',
                            title: 'Mid Term',
                            description: 'The mid-term timeframe analyzes the past 12 months of data, offering a balance between risk and return. It’s perfect for investors targeting quarterly or half-yearly trends, such as seasonal patterns or industry growth, with moderate volatility.',
                        },
                        {
                            term: 'long-term',
                            title: 'Long Term',
                            description: 'The long-term timeframe examines data from the last 24 months, focusing on consistent growth trends and company fundamentals. It’s ideal for investors seeking stability and steady returns, with less sensitivity to daily market fluctuations.',
                        }].map(({ term, title, description }) => (
                            <Grid item xs={4} key={term}>
                                <Tooltip title={description} arrow>
                                    <Card
                                        onClick={() => handleTermSelection(term)}
                                        sx={{
                                            cursor: 'pointer',
                                            border: selectedTerm === term ? '2px solid #1976d2' : '1px solid #ccc',
                                        }}
                                    >
                                        <CardContent>
                                            <Typography variant="h6" align="center">
                                                {title}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Tooltip>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Submit
                </Button>
            </form>

            {error && (
                <Typography variant="body1" color="error" sx={{ mt: 2 }}>
                    {error}
                </Typography>
            )}

{predictionResult && (
  <Card sx={{ mt: 4, p: 3, boxShadow: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
    <Typography variant="h5" gutterBottom align="center" sx={{ mb: 3 }}>
      📊 Stock Prediction Results
    </Typography>
    <Grid container spacing={3}>
      {/* Predicted Closing Price */}
      <Grid item xs={12} sm={6}>
        <Box sx={{ border: '1px solid #ddd', borderRadius: 2, p: 2, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Predicted Closing Price
          </Typography>
          <Typography variant="body1" color="primary" sx={{ fontSize: 24, fontWeight: 'bold' }}>
            ₹{predictionResult.predicted_closing_price}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            This is the estimated stock price based on historical data and trends.
          </Typography>
        </Box>
      </Grid>

      {/* Threshold Price */}
      <Grid item xs={12} sm={6}>
        <Box sx={{ border: '1px solid #ddd', borderRadius: 2, p: 2, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Threshold Price
          </Typography>
          <Typography variant="body1" color="secondary" sx={{ fontSize: 24, fontWeight: 'bold' }}>
            ₹{predictionResult.threshold_price}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            If the stock falls below this price, it may signal a high-risk zone.
          </Typography>
        </Box>
      </Grid>

      {/* Risk Percentage with Speedometer */}
      <Grid item xs={12}>
        <Box sx={{ border: '1px solid #ddd', borderRadius: 2, p: 4, textAlign: 'center', position: 'relative' }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Risk Level
          </Typography>
          <Box sx={{ position: 'relative', width: 200, height: 100, mx: 'auto' }}>
            <svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
              {/* Gauge Arc */}
              <path
                d="M 10 90 A 90 90 0 0 1 190 90"
                fill="none"
                stroke="#ddd"
                strokeWidth="10"
              />
              {/* Risk Level Arc */}
              <path
                d="M 10 90 A 90 90 0 0 1 190 90"
                fill="none"
                stroke={
                  predictionResult.risk_percentage < 33
                    ? "#4caf50" // Green for low risk
                    : predictionResult.risk_percentage < 66
                    ? "#ff9800" // Orange for moderate risk
                    : "#f44336" // Red for high risk
                }
                strokeWidth="10"
                strokeDasharray={`${predictionResult.risk_percentage * 2.7} ${270 -
                  predictionResult.risk_percentage * 2.7}`}
                strokeDashoffset="0"
              />
              {/* Risk Level Pointer */}
              <line
                x1="100"
                y1="90"
                x2={100 + 80 * Math.cos(((predictionResult.risk_percentage - 50) * Math.PI) / 50)}
                y2={90 - 80 * Math.sin(((predictionResult.risk_percentage - 50) * Math.PI) / 50)}
                stroke="black"
                strokeWidth="3"
              />
              {/* Labels */}
              <text x="10" y="95" fill="#4caf50" fontSize="12" fontWeight="bold">
                Less Risk
              </text>
              <text x="160" y="95" fill="#f44336" fontSize="12" fontWeight="bold">
                High Risk
              </text>
              <text x="90" y="30" fill="#ff9800" fontSize="12" fontWeight="bold">
                Moderate
              </text>
            </svg>
          </Box>
          <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
            The risk percentage is {predictionResult.risk_percentage}%. Lower risk indicates safer investments, while higher risk suggests greater volatility.
          </Typography>
        </Box>
      </Grid>

      {/* Mean Absolute Error */}
      <Grid item xs={12}>
        <Box sx={{ border: '1px solid #ddd', borderRadius: 2, p: 2, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Mean Absolute Error (MAE)
          </Typography>
          <Typography variant="body1" color="warning.main" sx={{ fontSize: 24, fontWeight: 'bold' }}>
            ₹{predictionResult.mean_absolute_error}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            The average difference between predicted and actual prices. A lower value indicates higher accuracy.
          </Typography>
        </Box>
      </Grid>

      {/* Predicted Closing Price + MAE */}
      <Grid item xs={12}>
        <Box sx={{ border: '1px solid #ddd', borderRadius: 2, p: 2, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Predicted Closing Price + MAE
          </Typography>
          <Typography variant="body1" color="primary" sx={{ fontSize: 24, fontWeight: 'bold' }}>
            ₹{(
              parseFloat(predictionResult.predicted_closing_price) +
              parseFloat(predictionResult.mean_absolute_error)
            ).toFixed(2)}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            The maximum estimated price, considering prediction error.
          </Typography>
        </Box>
      </Grid>
      <Box sx={{ maxWidth: 600, mx: 'auto', mt: 5, p: 3, boxShadow: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
        {/* ...existing form code */}
        
        <Button
            variant="outlined"
            color="secondary"
            fullWidth
            sx={{ mt: 2 }}
            onClick={() => navigate('/history')}
        >
            View Prediction History
        </Button>
    </Box>
    </Grid>
  </Card>
)}


        </Box>
    );
};

export default StockPredictionForm;
