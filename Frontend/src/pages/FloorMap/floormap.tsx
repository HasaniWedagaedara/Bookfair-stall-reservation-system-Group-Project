import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
} from '@mui/material';

interface Stall {
  id: string;
  size: 'Small' | 'Medium' | 'Large';
  widthUnits: number;
  heightUnits: number;
  row: number;
  col: number;
  price: number;
  
}

// ====================================================
// Floor layout based on uploaded map
// ====================================================

const stalls: Stall[] = [
  // === Top row: E1–E5 (Large) ===
  { id: 'E1', size: 'Large', widthUnits: 3, heightUnits: 2, row: 0, col: 0 , price: 40000},
  { id: 'E2', size: 'Large', widthUnits: 3, heightUnits: 2, row: 0, col: 3 , price: 40000},
  { id: 'E3', size: 'Large', widthUnits: 3, heightUnits: 2, row: 0, col: 6 , price: 40000},
  { id: 'E4', size: 'Large', widthUnits: 3, heightUnits: 2, row: 0, col: 9 , price: 40000},
  { id: 'E5', size: 'Large', widthUnits: 3, heightUnits: 2, row: 0, col: 12 ,price: 40000},

  // === A Section (Small) ===
  { id: 'A1', size: 'Small', widthUnits: 1, heightUnits: 1, row: 3, col: 0 , price: 15000},
  { id: 'A2', size: 'Small', widthUnits: 1, heightUnits: 1, row: 3, col: 1 , price: 15000},
  { id: 'A3', size: 'Small', widthUnits: 1, heightUnits: 1, row: 3, col: 2 , price: 15000},
  { id: 'A4', size: 'Small', widthUnits: 1, heightUnits: 1, row: 3, col: 3 , price: 15000},
  { id: 'A5', size: 'Small', widthUnits: 1, heightUnits: 1, row: 3, col: 4 , price: 15000},
  { id: 'A6', size: 'Small', widthUnits: 1, heightUnits: 1, row: 4, col: 0 , price: 15000},
  { id: 'A7', size: 'Small', widthUnits: 1, heightUnits: 1, row: 4, col: 1 , price: 15000},
  { id: 'A8', size: 'Small', widthUnits: 1, heightUnits: 1, row: 4, col: 2 , price: 15000},
  { id: 'A9', size: 'Small', widthUnits: 1, heightUnits: 1, row: 4, col: 3 , price: 15000},
  { id: 'A10', size: 'Small', widthUnits: 1, heightUnits: 1, row: 4, col: 4 , price: 15000},

  // === B Section (Medium) ===
  { id: 'B1', size: 'Medium', widthUnits: 2, heightUnits: 2, row: 3, col: 7 , price: 25000},
  { id: 'B2', size: 'Medium', widthUnits: 2, heightUnits: 2, row: 3, col: 9 , price: 25000},

  // === C Section (Small) ===
  { id: 'C1', size: 'Small', widthUnits: 1, heightUnits: 1, row: 3, col: 12 , price: 15000 },
  { id: 'C2', size: 'Small', widthUnits: 1, heightUnits: 1, row: 3, col: 13 , price: 15000},
  { id: 'C3', size: 'Small', widthUnits: 1, heightUnits: 1, row: 4, col: 12 , price: 15000},
  { id: 'C4', size: 'Small', widthUnits: 1, heightUnits: 1, row: 4, col: 13 , price: 15000},
  { id: 'C5', size: 'Small', widthUnits: 1, heightUnits: 1, row: 5, col: 12 , price: 15000},
  { id: 'C6', size: 'Small', widthUnits: 1, heightUnits: 1, row: 5, col: 13 , price: 15000},

  // === D Section (Large + Small mix) ===
  { id: 'D1', size: 'Medium', widthUnits: 2, heightUnits: 2, row: 7, col: 0 , price: 25000},
  { id: 'D2', size: 'Medium', widthUnits: 2, heightUnits: 2, row: 7, col: 2 , price: 25000},
  { id: 'D4', size: 'Medium', widthUnits: 2, heightUnits: 2,  row: 7, col: 4 , price: 25000},
  { id: 'D5', size: 'Medium', widthUnits: 2, heightUnits: 2,  row: 7, col: 6 , price: 25000},
  { id: 'D6', size: 'Medium', widthUnits: 2, heightUnits: 2,  row: 7, col: 8 , price: 25000},
  { id: 'D7', size: 'Medium', widthUnits: 2, heightUnits: 2,  row: 7, col: 10 , price: 25000},
  { id: 'D8', size: 'Small', widthUnits: 1, heightUnits: 1, row: 7, col: 12 , price: 15000},
  { id: 'D9', size: 'Small', widthUnits: 1, heightUnits: 1, row: 8, col: 12 , price: 15000},
  { id: 'D10', size: 'Small', widthUnits: 1, heightUnits: 1, row: 7, col: 13 , price: 15000},
  { id: 'D11', size: 'Small', widthUnits: 1, heightUnits: 1, row: 8, col: 13 , price: 15000},
];

const FloorMapPage: React.FC = () => {
  const [selected, setSelected] = useState<Stall | null>(null);
  const handleClick = (stall: Stall) => setSelected(stall);
  const handleClose = () => setSelected(null);

  const rows = Math.max(...stalls.map((s) => s.row + s.heightUnits)) + 1;
  const cols = Math.max(...stalls.map((s) => s.col + s.widthUnits)) + 1;

  return (
    <Container sx={{ py: 8 }}>
      <Typography variant="h3" align="center" gutterBottom>
        Colombo International Book Fair – Floor Map
      </Typography>
      <Typography variant="body1" align="center" color="textSecondary" paragraph>
        Click on a stall to see details.
      </Typography>

      {/* FLOOR GRID */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateRows: `repeat(${rows}, 60px)`,
          gridTemplateColumns: `repeat(${cols}, 60px)`,
          gap: 1,
          justifyContent: 'center',
          mt: 4,
          mb: 6,
        }}
      >
        {stalls.map((stall) => (
          <Button
            key={stall.id}
            onClick={() => handleClick(stall)}
            variant="contained"
            sx={{
              gridRow: `${stall.row + 1} / span ${stall.heightUnits}`,
              gridColumn: `${stall.col + 1} / span ${stall.widthUnits}`,
              borderRadius: 1,
              fontWeight: 'bold',
              color: 'white',
              backgroundColor:
                stall.size === 'Small'
                  ? '#FFD700' // Yellow
                  : stall.size === 'Medium'
                  ? '#FF69B4' // Pink
                  : '#4682B4', // Blue
              '&:hover': { opacity: 0.85 },
            }}
          >
            {stall.id}
          </Button>
        ))}

        {/* Non-clickable placeholders */}


        <Box
          sx={{
            gridRow: `${11}`,
            gridColumn: `6 / span 2`,
            backgroundColor: '#ddd',
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            color: '#333',
          }}
        >
          Entrance
        </Box>
      </Box>

      {/* STALL DETAILS */}
      <Dialog open={!!selected} onClose={handleClose}>
        <DialogTitle>Stall {selected?.id}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <strong>Size:</strong> {selected?.size} <br />
            <strong>Price:</strong>Rs.{selected?.price} <br />
            <strong>Width Units:</strong> {selected?.widthUnits} <br />
            <strong>Height Units:</strong> {selected?.heightUnits} <br />
            <strong>Position:</strong> Row {selected?.row + 1}, Col {selected?.col + 1}
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default FloorMapPage;
