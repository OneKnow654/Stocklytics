import React, { useState } from 'react';
import { TextField, Button, MenuItem, Box, Typography, Grid } from '@mui/material';
import StockSuggestions from './StockSuggestions';

const StockPredictionForm = () => {
    const [ticker, setTicker] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [timeframe, setTimeframe] = useState('');
    const [riskPercentage, setRiskPercentage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        const predictionData = {
            ticker,
            start: startDate,
            end: endDate,
            timeframe,
            risk_percentage: parseFloat(riskPercentage),
        };

        console.log('Prediction Data:', predictionData);
        // Send data to the backend
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                maxWidth: 500,
                margin: '0 auto',
                p: 3,
                borderRadius: 2,
                boxShadow: 3,
                backgroundColor: 'white',
            }}
        >
            <Typography variant="h5" component="h2" gutterBottom>
                Stock Prediction Form
            </Typography>

            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <StockSuggestions onSelect={setTicker} />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Start Date"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        required
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="End Date"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        required
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        select
                        label="Timeframe"
                        value={timeframe}
                        onChange={(e) => setTimeframe(e.target.value)}
                        required
                    >
                        <MenuItem value="short-term">Short-Term</MenuItem>
                        <MenuItem value="long-term">Long-Term</MenuItem>
                    </TextField>
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Risk Percentage"
                        type="number"
                        value={riskPercentage}
                        onChange={(e) => setRiskPercentage(e.target.value)}
                        InputProps={{ inputProps: { step: 0.01 } }}
                        required
                    />
                </Grid>

                <Grid item xs={12}>
                    <Button variant="contained" color="primary" type="submit" fullWidth>
                        Submit
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default StockPredictionForm;
