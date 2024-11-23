import React, { useState } from 'react';
import axios from 'axios';

const StockSuggestions = ({ onSelect }) => {
    const [input, setInput] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    const handleInputChange = async (e) => {
        const value = e.target.value;
        setInput(value);

        if (value.trim() === '') {
            setSuggestions([]);
            return;
        }

        try {
            const response = await axios.get(`/suggestions/${value}`);
            setSuggestions(response.data);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        }
    };

    const handleSelect = (ticker) => {
        onSelect(ticker);
        setInput('');
        setSuggestions([]);
    };

    return (
        <div style={{ position: 'relative' }}>
            <input
                type="text"
                value={input}
                onChange={handleInputChange}
                placeholder="Enter stock ticker"
                style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                }}
            />
            {suggestions.length > 0 && (
                <ul
                    style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        backgroundColor: 'white',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        listStyle: 'none',
                        padding: '0',
                        margin: '0',
                        maxHeight: '200px',
                        overflowY: 'auto',
                        zIndex: 10,
                    }}
                >
                    {suggestions.map((ticker) => (
                        <li
                            key={ticker}
                            onClick={() => handleSelect(ticker)}
                            style={{
                                padding: '10px',
                                cursor: 'pointer',
                                borderBottom: '1px solid #f0f0f0',
                            }}
                        >
                            {ticker}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default StockSuggestions;
