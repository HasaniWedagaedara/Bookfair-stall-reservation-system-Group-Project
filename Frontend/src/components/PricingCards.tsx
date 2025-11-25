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
  onViewStallsClick: (size: string) => void;
  isAvailable: boolean;
}

const PricingCard: React.FC<PricingCardProps> = ({ name, price, Size, features, idealFor, isAvailable, onViewStallsClick }) => {
  const featureList = features.split('\n');

  return (
    <Card
      variant="outlined"
      sx={{
        maxWidth: 345,
        margin: "auto",
        mt: 4,
        borderRadius: 3,
        boxShadow: 3,
        transition: "transform 0.2s ease-in-out, opacity 0.2s",
        opacity: isAvailable ? 1 : 0.7, 
        "&:hover": {
          transform: isAvailable ? "scale(1.03)" : "none",
          cursor: isAvailable ? "pointer" : "default",
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
          sx={{ fontWeight: "bold", mb: 1, color: isAvailable ? 'textPrimary' : 'gray' }}
        >
          {price}
        </Typography>
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ minHeight: 120, maxHeight: 150, overflow: 'hidden' }}> 
          {featureList.map((item, index) => (
              <Box key={index} display="flex" alignItems="flex-start" mb={0.5}>
                {item.trim() ? ( // Only show icon if line is not empty
                    <CheckIcon sx={{ color: isAvailable ? "green" : "gray", mr: 1, fontSize: 18, mt: '2px' }} />
                ) : null}
                <Typography variant="body2" sx={{ whiteSpace: 'pre-line', lineHeight: 1.4 }}>
                    {item}
                </Typography>
              </Box>
          ))}
          
        </Box>
      </CardContent>
      <CardActions>
        <Button 
          variant="contained" 
          color="secondary" 
          fullWidth
          disabled={!isAvailable}
          onClick={() => onViewStallsClick(Size)}
        >
          {isAvailable ? "View Available Stalls" : "SOLD OUT"}
        </Button>
      </CardActions>
    </Card>
  );
};

export default PricingCard;