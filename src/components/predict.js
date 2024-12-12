import React, { useState } from 'react';
import { Box, Button, Card, CardContent, Typography, Grid, Tooltip } from '@mui/material';
import StockSuggestions from './StockSuggestions';

const StockPredictionForm = () => {
    const [ticker, setTicker] = useState('');
    const [selectedTerm, setSelectedTerm] = useState(null);
    const [predictionResult, setPredictionResult] = useState(null);
    const [error, setError] = useState('');

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

      {/* Risk Percentage */}
      <Grid item xs={12}>
        <Box sx={{ border: '1px solid #ddd', borderRadius: 2, p: 2 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Risk Percentage
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body1" color={predictionResult.risk_percentage < 50 ? 'success.main' : 'error.main'} sx={{ fontSize: 24, fontWeight: 'bold' }}>
              {predictionResult.risk_percentage}%
            </Typography>
            <Box sx={{ width: '100%' }}>
              <Box
                sx={{
                  width: `${predictionResult.risk_percentage}%`,
                  height: 10,
                  bgcolor: predictionResult.risk_percentage < 50 ? 'success.main' : 'error.main',
                  borderRadius: 5,
                }}
              />
            </Box>
          </Box>
          <Typography variant="caption" color="textSecondary">
            This indicates the potential risk level for this stock.
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
    </Grid>
  </Card>
)}


        </Box>
    );
};

export default StockPredictionForm;
