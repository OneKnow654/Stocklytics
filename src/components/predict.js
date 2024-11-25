import React, { useState } from 'react';
import { Box, Button, Card, CardContent, Typography, Grid, TextField, Tooltip } from '@mui/material';
import StockSuggestions from './StockSuggestions';

const StockPredictionForm = () => {
    const [ticker, setTicker] = useState('');
    const [riskPercentage, setRiskPercentage] = useState('');
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
            start: startDate.toISOString().split('T')[0], // Convert to YYYY-MM-DD format
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
            risk_percentage: parseFloat(riskPercentage),
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
                        {[
                            {
                                term: 'short-term',
                                title: 'Short Term',
                                description: 'Focuses on the last 7 months of data.',
                            },
                            {
                                term: 'mid-term',
                                title: 'Mid Term',
                                description: 'Covers data from the last 12 months.',
                            },
                            {
                                term: 'long-term',
                                title: 'Long Term',
                                description: 'Analyzes the last 24 months of data.',
                            },
                        ].map(({ term, title, description }) => (
                            <Grid item xs={4} key={term}>
                                <Tooltip title={description} arrow>
                                    <Card
                                        onClick={() => handleTermSelection(term)}
                                        sx={{
                                            cursor: 'pointer',
                                            border:
                                                selectedTerm === term ? '2px solid #1976d2' : '1px solid #ccc',
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
                <Box sx={{ mb: 2 }}>
                    <TextField
                        label="Risk Percentage"
                        type="number"
                        value={riskPercentage}
                        onChange={(e) => setRiskPercentage(e.target.value)}
                        fullWidth
                        inputProps={{ step: 0.01 }}
                        required
                    />
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
                        <Grid container spacing={2}>
                            {[
                                {
                                    label: 'Predicted Closing Price',
                                    value: predictionResult.predicted_closing_price,
                                },
                                {
                                    label: 'Threshold Price',
                                    value: predictionResult.threshold_price,
                                },
                                {
                                    label: 'Mean Absolute Error',
                                    value: predictionResult.mean_absolute_error,
                                },
                                {
                                    label: 'Mean Absolute Percentage Error',
                                    value: predictionResult.mean_absolute_percentage_error,
                                },
                                {
                                    label: 'Mean Squared Error',
                                    value: predictionResult.mean_squared_error,
                                },
                            ].map(({ label, value }) => (
                                <Grid item xs={12} key={label}>
                                    <Typography variant="body1">
                                        <strong>{label}:</strong> {value}
                                    </Typography>
                                </Grid>
                            ))}
                        </Grid>
                    </CardContent>
                </Card>
            )}
        </Box>
    );
};

export default StockPredictionForm;
