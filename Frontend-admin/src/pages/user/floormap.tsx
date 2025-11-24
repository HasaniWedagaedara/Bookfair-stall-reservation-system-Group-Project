import React, { useState, useEffect } from "react";
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
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

interface Stall {
  id: string;
  name: string;
  size: "SMALL" | "MEDIUM" | "LARGE";
  price: number;
  status: "AVAILABLE" | "RESERVED" | "MAINTENANCE";
  widthUnits: number;
  heightUnits: number;
  row: number;
  col: number;
}

const mockStallData: Stall[] = [
  {
    id: "uuid-1",
    name: "E1",
    size: "LARGE",
    price: 40000,
    status: "AVAILABLE",
    widthUnits: 3,
    heightUnits: 2,
    row: 0,
    col: 0,
  },
  {
    id: "uuid-2",
    name: "E2",
    size: "LARGE",
    price: 40000,
    status: "RESERVED",
    widthUnits: 3,
    heightUnits: 2,
    row: 0,
    col: 3,
  },
  {
    id: "uuid-3",
    name: "E3",
    size: "LARGE",
    price: 40000,
    status: "AVAILABLE",
    widthUnits: 3,
    heightUnits: 2,
    row: 0,
    col: 6,
  },
  {
    id: "uuid-4",
    name: "A1",
    size: "SMALL",
    price: 15000,
    status: "AVAILABLE",
    widthUnits: 1,
    heightUnits: 1,
    row: 3,
    col: 0,
  },
  {
    id: "uuid-5",
    name: "A2",
    size: "SMALL",
    price: 15000,
    status: "MAINTENANCE",
    widthUnits: 1,
    heightUnits: 1,
    row: 3,
    col: 1,
  },
  {
    id: "uuid-5",
    name: "A5",
    size: "MEDIUM",
    price: 15000,
    status: "MAINTENANCE",
    widthUnits: 2,
    heightUnits: 2,
    row: 4,
    col: 0,
  },
];

const FloorMapPage: React.FC = () => {
  const [stalls, setStalls] = useState<Stall[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState<Stall | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStalls = () => {
      setTimeout(() => {
        setStalls(mockStallData);
        setIsLoading(false);
      }, 1000);
    };

    fetchStalls();
  }, []);

  const handleClick = (stall: Stall) => {
    if (stall.status === "AVAILABLE") {
      setSelected(stall);
    }
  };

  const handleClose = () => setSelected(null);

  const handleConfirmReservation = async () => {
    if (!selected) return;

    try {
      console.log('Reserving stall:', selected.id);
      navigate('/dashboard');
    } catch (error) {
      console.error("Failed to reserve stall:", error);
    } finally {
      handleClose();
    }
  };

  const getStallColor = (status: Stall['status']) => {
    if (status === "RESERVED") return "#a0a0a0";
    if (status === "MAINTENANCE") return "#f5a623";
    return "#4682B4";
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading Floor Map...</Typography>
      </Box>
    );
  }

  const rows = Math.max(...stalls.map((s) => s.row + s.heightUnits)) + 1;
  const cols = Math.max(...stalls.map((s) => s.col + s.widthUnits)) + 1;

  return (
    <Container sx={{ py: 8, mb: 6 }}>
      <Typography variant="h3" align="center" gutterBottom>
        Colombo International Book Fair – Floor Map
      </Typography>
      <Typography
        variant="body1"
        align="center"
        color="textSecondary"
        paragraph
      >
        Click on an available stall to reserve.
        <br />
        <br />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 3, // spacing between items
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                bgcolor: "#4682B4",
                borderRadius: "50%",
              }}
            />
            <span>AVAILABLE</span>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                bgcolor: "#a0a0a0",
                borderRadius: "50%",
              }}
            />
            <span>RESERVED</span>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                bgcolor: "#f5a623",
                borderRadius: "50%",
              }}
            />
            <span>MAINTENANCE</span>
          </Box>
        </Box>
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
            disabled={stall.status !== "AVAILABLE"}
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
              "&.Mui-disabled": {
                backgroundColor: "#a0a0a0",
                color: "#f0f0f0",
              },
            }}
          >
            {stall.name}
          </Button>
        ))}
      </Box>

      <Dialog open={!!selected} onClose={handleClose}>
        <DialogTitle>Reserve Stall {selected?.name}?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <strong>Size:</strong> {selected?.size} <br />
            <strong>Price:</strong> Rs. {selected?.price} <br />
            <strong>Status:</strong> {selected?.status}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleConfirmReservation}
            variant="contained"
            autoFocus
          >
            Confirm Reservation
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default FloorMapPage;