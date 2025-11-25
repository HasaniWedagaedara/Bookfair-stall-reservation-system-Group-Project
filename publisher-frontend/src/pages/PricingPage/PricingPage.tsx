import React from 'react';
import { Button, Container, Grid, Typography } from '@mui/material';
import PricingCard from './PricingCards';
import { useNavigate } from 'react-router-dom';

const plans = [
  {
    title: 'Small Stall',
    price: 'Rs. 15,000',
    features: [
      'Size: 2m x 2m',
      'Includes one table and two chairs',
      'Ideal for small publishers or startups',
    ],
  },
  {
    title: 'Medium Stall',
    price: 'Rs. 25,000',
    features: [
      'Size: 3m x 3m',
      'Includes two tables and four chairs',
      'Ideal for mid-sized publishers or vendors',
    ],
  },
  {
    title: 'Large Stall',
    price: 'Rs. 40,000',
    features: [
      'Size: 4m x 4m',
      'Includes two tables, six chairs, and electricity access',
      'Ideal for major publishers or distributors',
    ],
  },
];

const PricingPage = () => {
  const navigate = useNavigate(); // ← call hook here at the top of the component

  return (
    <Container sx={{ py: 8 }}>
      <Typography variant="h2" align="center" gutterBottom>
        Stall Pricing Plans
      </Typography>
      <Typography variant="h5" align="center" color="textSecondary" paragraph>
        Choose the stall size that best fits your needs at the Colombo International Book Fair.
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {plans.map((plan, index) => (
          <Grid
            item
            key={index}
            xs={12}
            sm={6}
            md={3}
            style={{
              transform:
                index === Math.floor(plans.length / 2) ? 'scale(1.1)' : 'none',
              transition: 'transform 0.3s ease-in-out',
            }}
          >
            <PricingCard
              title={plan.title}
              price={plan.price}
              features={plan.features}
            />
          </Grid>
        ))}
      </Grid>

      {/* Button to navigate to Floor Map */}
      <Grid container justifyContent="center" sx={{ mt: 6 }}>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          onClick={() => navigate('/map')} // ← use navigate function here
        >
          View Floor Map
        </Button>
      </Grid>
    </Container>
  );
};

export default PricingPage;
