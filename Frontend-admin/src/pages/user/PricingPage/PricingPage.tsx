import { Button, Container, Grid, Typography } from '@mui/material';
import PricingCard from './PricingCards';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Stall {
  id: string;
  name: string;
  size: string;
  price: number;
  idealFor: string;
  features: string;
}

const PricingPage = () => {
  const navigate = useNavigate(); 
  const [stalls, setStalls] = useState<Stall[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStalls = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/stalls/available"
        ); 
        setStalls(response.data.stalls);
      } catch (error) {
        console.error("Error fetching stalls:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStalls();
  }, []);

  if (loading) return <Typography align="center">Loading stalls...</Typography>;


  return (
    <Container sx={{ py: 8 }}>
      <Typography variant="h2" align="center" gutterBottom>
        Stall Pricing Plans
      </Typography>
      <Typography variant="h5" align="center" color="textSecondary" paragraph>
        Choose the stall size that best fits your needs at the Colombo
        International Book Fair.
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {stalls.map((stall, index) => (
          <Grid
            item
            key={index}
            xs={12}
            sm={6}
            md={3}
            style={{
              transform:
                index === Math.floor(stalls.length / 2) ? "scale(1.1)" : "none",
              transition: "transform 0.3s ease-in-out",
            }}
          >
            <PricingCard
              name={stall.name}
              price={`Rs. ${stall.price.toLocaleString()}`}
              Size={stall.size}
              features={stall.features}
              idealFor={stall.idealFor}
            />
          </Grid>
        ))}
      </Grid>

      <Grid container justifyContent="center" sx={{ mt: 6 }}>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          onClick={() => navigate("/map")} // ← use navigate function here
        >
          View Floor Map
        </Button>
      </Grid>
    </Container>
  );
};

export default PricingPage;
