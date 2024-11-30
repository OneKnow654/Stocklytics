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
                <Card sx={{ mt: 4, boxShadow: 3 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Prediction Results
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: 2,
                                    border: '1px solid #ccc',
                                    borderRadius: 2,
                                    bgcolor: 'background.default',
                                }}
                            >
                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                    Predicted Closing Price:
                                </Typography>
                                <Typography variant="body1" color="primary">
                                    ₹{predictionResult.predicted_closing_price}
                                </Typography>
                            </Box>

                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: 2,
                                    border: '1px solid #ccc',
                                    borderRadius: 2,
                                    bgcolor: 'background.default',
                                }}
                            >
                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                    Threshold Price:
                                </Typography>
                                <Typography variant="body1" color="primary">
                                    ₹{predictionResult.threshold_price}
                                </Typography>
                            </Box>

                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: 2,
                                    border: '1px solid #ccc',
                                    borderRadius: 2,
                                    bgcolor: 'background.default',
                                }}
                            >
                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                    Mean Absolute Error:
                                </Typography>
                                <Typography variant="body1" color="secondary">
                                    ₹{predictionResult.mean_absolute_error}
                                </Typography>
                            </Box>

                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: 2,
                                    border: '1px solid #ccc',
                                    borderRadius: 2,
                                    bgcolor: 'background.default',
                                }}
                            >
                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                    Predicted Closing Price + Mean Absolute Error:
                                </Typography>
                                <Typography variant="body1" color="primary">
                                ₹
                                    {(
                                        parseFloat(predictionResult.predicted_closing_price) +
                                        parseFloat(predictionResult.mean_absolute_error)
                                    ).toFixed(2)}
                                </Typography>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            )}
        </Box>
    );
};

export default StockPredictionForm;
