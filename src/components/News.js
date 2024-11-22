import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Card, CardContent, CardMedia, Button, CircularProgress } from '@mui/material';

const API_KEY = 'd9fc775c1a854d028b3c8a4a443d4a6e'; // Replace with your actual NewsAPI key

const News = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://newsapi.org/v2/everything?q=stocks+india&apiKey=${API_KEY}`)
      .then((response) => response.json())
      .then((data) => {
        setArticles(data.articles);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching news:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container sx={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Latest Stock News
      </Typography>
      {articles.map((article, index) => (
        <Card key={index} sx={{ display: 'flex', marginBottom: '20px' }}>
          {article.urlToImage && (
            <CardMedia
              component="img"
              sx={{ width: 160 }}
              image={article.urlToImage}
              alt={article.title}
            />
          )}
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <CardContent>
              <Typography component="h5" variant="h5">
                {article.title}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                {article.source.name} - {new Date(article.publishedAt).toLocaleDateString()}
              </Typography>
              <Typography variant="body1" paragraph>
                {article.description}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Read More
              </Button>
            </CardContent>
          </Box>
        </Card>
      ))}
    </Container>
  );
};

export default News;
