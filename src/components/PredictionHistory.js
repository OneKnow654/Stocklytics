import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, CircularProgress } from '@mui/material';

const PredictionHistory = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch prediction history from the backend
        fetch('http://localhost:5000/history')
            .then((response) => response.json())
            .then((data) => {
                setHistory(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Error fetching prediction history:', err);
                setLoading(false);
            });
    }, []);

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', mt: 5, p: 3, boxShadow: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
            <Typography variant="h5" gutterBottom>
                Past Prediction History
            </Typography>
            {loading ? (
                <CircularProgress />
            ) : history.length === 0 ? (
                <Typography variant="body1" color="textSecondary">
                    No history available.
                </Typography>
            ) : (
                <List>
                    {history.map((item, index) => (
                        <ListItem key={index}>
                            <ListItemText
                                primary={`Ticker: ${item.ticker} - Predicted Price: ₹${item.predicted_price}`}
                                secondary={`Date: ${item.date} | Timeframe: ${item.timeframe}`}
                            />
                        </ListItem>
                    ))}
                </List>
            )}
        </Box>
    );
};

export default PredictionHistory;
