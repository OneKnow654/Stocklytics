import React, { useState } from 'react';
import StockSuggestions from './StockSuggestions';

const StockPredictionForm = () => {
    const [ticker, setTicker] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [timeframe, setTimeframe] = useState('');
    const [riskPercentage, setRiskPercentage] = useState('');
    const [predictionResult, setPredictionResult] = useState(null);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const predictionData = {
            ticker,
            start: startDate,
            end: endDate,
            timeframe,
            risk_percentage: parseFloat(riskPercentage),
        };
        console.log(predictionData)
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
        <form onSubmit={handleSubmit} style={{ maxWidth: '500px', margin: '0 auto' }}>
            <h2>Stock Prediction Form</h2>
            <div>
                <label>Ticker:</label>
                <StockSuggestions onSelect={setTicker} />
            </div>
            <div>
                <label>Start Date:</label>
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>End Date:</label>
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Timeframe:</label>
                <select
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value)}
                    required
                >
                    <option value="">Select</option>
                    <option value="short-term">Short-Term</option>
                    <option value="long-term">Long-Term</option>
                </select>
            </div>
            <div>
                <label>Risk Percentage:</label>
                <input
                    type="number"
                    value={riskPercentage}
                    onChange={(e) => setRiskPercentage(e.target.value)}
                    step="0.01"
                    required
                />
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};

export default StockPredictionForm;
