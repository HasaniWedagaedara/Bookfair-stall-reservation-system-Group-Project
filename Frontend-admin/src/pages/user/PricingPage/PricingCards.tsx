import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Divider,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

interface PricingCardProps {
  name: string;
  price: string;
  Size: string;
  features: string;
  idealFor: string;
  dimensions?: string;
}

const PricingCard: React.FC<PricingCardProps> = ({ name, price, Size, features, idealFor }) => {
  return (
    <Card
      variant="outlined"
      sx={{
        maxWidth: 345,
        margin: "auto",
        mt: 4,
        borderRadius: 3,
        boxShadow: 3,
        transition: "transform 0.2s ease-in-out",
        "&:hover": {
          transform: "scale(1.03)",
        },
      }}
    >
      <CardContent>
        <Typography
          variant="h5"
          component="div"
          gutterBottom
          sx={{
            fontWeight: "bold",
            color: "primary.main",
            textAlign: "center",
          }}
        >
          {name}
        </Typography>
        <Typography
          variant="h4"
          component="div"
          align="center"
          sx={{ fontWeight: "bold", mb: 1 }}
        >
          {price}
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Box>
          <Box display="flex" alignItems="center" mb={1}>
            <CheckIcon sx={{ color: "green", mr: 1 }} />
            <Typography variant="body2">Size : {Size}</Typography>
          </Box>
          <Box display="flex" alignItems="center" mb={1}>
            <CheckIcon sx={{ color: "green", mr: 1 }} />
            <Typography variant="body2">
              {features}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" mb={1}>
            <CheckIcon sx={{ color: "green", mr: 1 }} />
            <Typography variant="body2">
              Ideal for {idealFor}
            </Typography>
          </Box>
        </Box>
      </CardContent>
      <CardActions>
        <Button variant="contained" color="secondary" fullWidth>
          Book Stall
        </Button>
      </CardActions>
    </Card>
  );
};

export default PricingCard;
