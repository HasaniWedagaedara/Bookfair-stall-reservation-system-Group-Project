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
  DialogActions,
} from '@mui/material';

// --- Mock Data ---
interface AdminStall {
  id: string;
  name: string;
  size: 'SMALL' | 'MEDIUM' | 'LARGE';
  status: 'AVAILABLE' | 'RESERVED' | 'MAINTENANCE';
  reservedBy: string | null;
  widthUnits: number;
  heightUnits: number;
  row: number;
  col: number;
}

const mockStallData: AdminStall[] = [
  { id: 'uuid-1', name: 'E1', size: 'LARGE', status: 'AVAILABLE', reservedBy: null, widthUnits: 3, heightUnits: 2, row: 0, col: 0 },
  { id: 'uuid-2', name: 'E2', size: 'LARGE', status: 'RESERVED', reservedBy: 'Bookworm Creations', widthUnits: 3, heightUnits: 2, row: 0, col: 3 },
  { id: 'uuid-3', name: 'E3', size: 'LARGE', status: 'AVAILABLE', reservedBy: null, widthUnits: 3, heightUnits: 2, row: 0, col: 6 },
  { id: 'uuid-4', name: 'A1', size: 'SMALL', status: 'RESERVED', reservedBy: 'Readers Corner', widthUnits: 1, heightUnits: 1, row: 3, col: 0 },
  { id: 'uuid-5', name: 'A2', size: 'SMALL', status: 'MAINTENANCE', reservedBy: null, widthUnits: 1, heightUnits: 1, row: 3, col: 1 },
];
// ---

const AdminFloorMap = () => {
  const [stalls] = useState<AdminStall[]>(mockStallData);
  const [selected, setSelected] = useState<AdminStall | null>(null);

  const handleClick = (stall: AdminStall) => {
    setSelected(stall); 
  };

  const handleClose = () => setSelected(null);

  const getStallColor = (status: AdminStall['status']) => {
    if (status === "RESERVED") return "#a0a0a0";
    if (status === "MAINTENANCE") return "#f5a623";
    return "#4682B4";
  };

  const rows = Math.max(...stalls.map((s) => s.row + s.heightUnits)) + 1;
  const cols = Math.max(...stalls.map((s) => s.col + s.widthUnits)) + 1;

  return (
    <Container sx={{ py: 8, mb: 6 }}>
      <Typography variant="h3" align="center" gutterBottom>
        Admin - Stall Availability Map
      </Typography>
      <Typography variant="body1" align="center" color="textSecondary" paragraph>
        Click any stall to view its status.
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateRows: `repeat(${rows}, 60px)`,
          gridTemplateColumns: `repeat(${cols}, 60px)`,
          gap: 1,
          justifyContent: "center",
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
              fontWeight: "bold",
              color: "white",
              backgroundColor: getStallColor(stall.status),
              "&:hover": { 
                opacity: 0.85,
                backgroundColor: getStallColor(stall.status),
              },
            }}
          >
            {stall.name}
          </Button>
        ))}
      </Box>

      <Dialog open={!!selected} onClose={handleClose}>
        <DialogTitle>Stall {selected?.name}</DialogTitle>
        <DialogContent>
          <DialogContentText component={'div'} sx={{ color: 'text.primary' }}>
            <Typography component="span" fontWeight="bold">Size: </Typography>
            {selected?.size}
            <br />
            <Typography component="span" fontWeight="bold">Status: </Typography>
            {selected?.status}
            
            {selected?.status === 'RESERVED' && (
              <Box component="div" sx={{ mt: 0.5 }}>
                <Typography component="span" fontWeight="bold">Reserved By: </Typography>
                {selected?.reservedBy}
              </Box>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminFloorMap;