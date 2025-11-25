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
import axios from "axios";
import toast from "react-hot-toast";

// --- Required Frontend Interface ---
interface Stall {
  id: string;
  name: string;
  size: "SMALL" | "MEDIUM" | "LARGE";
  price: number;
  status: "AVAILABLE" | "RESERVED" | "MAINTENANCE"; // Backend Status
  // REQUIRED GRID PROPERTIES (MUST BE INJECTED ON FRONTEND)
  widthUnits: number; 
  heightUnits: number;
  row: number;
  col: number;
}

// --- HARDCODED GRID DATA MAP (ADJUSTED FOR VISUAL ALIGNMENT) ---
// Note: Grid coordinates start at [0, 0] top-left.
const GRID_DATA_MAP: { [key: string]: Pick<Stall, 'widthUnits' | 'heightUnits' | 'row' | 'col'> } = {
  // Stalls A1 and A2 (Small, 1x1 units) - Aligned to show small block
  'A1': { row: 3, col: 1, widthUnits: 1, heightUnits: 1 },
  'A2': { row: 3, col: 2, widthUnits: 1, heightUnits: 1 },
  
  // Stalls B1 and D1 (B1 is Medium 2x2, D1 is Small 1x1) - Placed below A1/A2 and next to each other
  'B1': { row: 5, col: 3, widthUnits: 2, heightUnits: 2 }, // Adjusted position for visual grouping
  'D1': { row: 5, col: 5, widthUnits: 1, heightUnits: 1 }, // Adjusted position
  
  // Stall C1 (Large, 3x3 units) - Placed further down/right
  'C1': { row: 7, col: 7, widthUnits: 3, heightUnits: 3 }, // Adjusted position
  
  // Placeholder stalls (optional, kept from previous response)
  'E1': { row: 0, col: 0, widthUnits: 3, heightUnits: 2 },
  'E2': { row: 0, col: 3, widthUnits: 3, heightUnits: 2 },
  'E3': { row: 0, col: 6, widthUnits: 3, heightUnits: 2 },
  'A5': { row: 4, col: 0, widthUnits: 2, heightUnits: 2 },
};
// ---------------------------------


// Helper function to map backend data to the full Stall interface
const mapStallsWithGridData = (apiStalls: any[]): Stall[] => {
  return apiStalls
    .map(apiStall => {
      const gridProps = GRID_DATA_MAP[apiStall.name];
      // Only include stalls that have a corresponding grid definition
      if (!gridProps) {
        console.warn(`Stall name '${apiStall.name}' not found in GRID_DATA_MAP. Skipping.`);
        return null; 
      }

      // Merge the backend data with the frontend grid data
      return {
        id: apiStall.id,
        name: apiStall.name,
        size: apiStall.size as Stall['size'],
        price: apiStall.price, // 'price' maps from backend
        status: apiStall.status as Stall['status'], // 'status' maps from backend
        ...gridProps,
      } as Stall;
    })
    .filter((stall): stall is Stall => stall !== null);
};


const FloorMapPage: React.FC = () => {
  const [stalls, setStalls] = useState<Stall[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState<Stall | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStalls = async () => {
      try {
        const response = await axios.get("http://localhost:5000/stalls"); 
        
        // Backend returns: { count: number, stalls: [] }. Extract the stalls array.
        const apiStalls = response.data.stalls || []; 

        // INJECT THE GRID DATA HERE
        const mappedStalls = mapStallsWithGridData(apiStalls);
        
        setStalls(mappedStalls);
      } catch (error) {
        console.error("Failed to fetch stalls:", error);
        toast.error("Failed to load map data from server. Check backend API.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStalls();
  }, []);

  const handleClick = (stall: Stall) => {
    if (stall.status === "AVAILABLE") {
      setSelected(stall);
    } else {
        // FIXED: Replaced toast.info with toast.error/warn/success to fix TS error
        toast.error(`Stall ${stall.name} is ${stall.status.toLowerCase()}.`); 
    }
  };

  const handleClose = () => setSelected(null);

  const handleConfirmReservation = async () => {
    if (!selected) return;
    const stallToReserve = selected;

    try {
      const reservationPayload = {
        stallId: stallToReserve.id,
        totalAmount: stallToReserve.price, 
      };

      const response = await axios.post(
        "http://localhost:5000/reservations",
        reservationPayload,
        { withCredentials: true }
      );
      
      console.log('Reservation confirmed:', response.data);
      toast.success(`Stall ${stallToReserve.name} reserved successfully! You will receive an email confirmation with your QR pass.`);

      // Update the local state to show the stall is now reserved
      setStalls(prevStalls => 
        prevStalls.map(s => 
          s.id === stallToReserve.id ? { ...s, status: "RESERVED" } : s
        )
      );
      
      handleClose(); 
      navigate('/dashboard'); 
      
    } catch (error) {
      console.error("Failed to reserve stall:", error);
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage = error.response.data.message || "Failed to reserve stall.";
        toast.error(errorMessage);
      } else {
        toast.error("An unexpected error occurred during reservation.");
      }
    }
  };

  const getStallColor = (status: Stall['status']) => {
    // MAINTENANCE should be yellow/orange, RESERVED should be gray.
    if (status === "RESERVED") return "#a0a0a0"; // Gray
    if (status === "MAINTENANCE") return "#f5a623"; // Yellow/Orange
    return "#4682B4"; // Blue (Available)
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading Floor Map...</Typography>
      </Box>
    );
  }

  // Calculate grid dimensions based on the injected data
  const maxRow = Math.max(0, ...stalls.map((s) => s.row + s.heightUnits));
  const maxCol = Math.max(0, ...stalls.map((s) => s.col + s.widthUnits));
  const rows = maxRow + 1;
  const cols = maxCol + 1;

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
            gap: 3, 
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
            <strong>Price:</strong> Rs. {selected?.price?.toLocaleString()} <br />
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