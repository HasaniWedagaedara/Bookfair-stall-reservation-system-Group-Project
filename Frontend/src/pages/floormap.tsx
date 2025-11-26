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
  dimensions: string; 
  // REQUIRED GRID PROPERTIES (Calculated dynamically)
  widthUnits: number; 
  heightUnits: number;
  row: number;
  col: number;
}

// --- HARDCODED POSITIONING MAP (FIXED FOR OVERLAP AND EXPANDED TO 30+ STALLS) ---
const POSITION_MAP: { [key: string]: Pick<Stall, 'row' | 'col'> } = {
    // ZONE E (Large, Top Row - Start Row 0)
    'E1': { row: 0, col: 0 },
    'E2': { row: 0, col: 5 }, 
    'E3': { row: 0, col: 10 }, 
    'E4': { row: 0, col: 15 },
    
    // ZONE F (Medium, Below E - Start Row 4)
    'F1': { row: 4, col: 0 },
    'F2': { row: 4, col: 4 },
    'F3': { row: 4, col: 8 },

    // ZONE A (Small, 1-2 unit wide - Start Row 8)
    'A1': { row: 8, col: 0 },
    'A2': { row: 8, col: 2 },
    'A3': { row: 8, col: 4 },
    'A4': { row: 8, col: 6 }, 
    'A5': { row: 8, col: 9 },
    'A6': { row: 8, col: 11 },
    'A7': { row: 8, col: 13 },
    'A8': { row: 8, col: 15 }, 
    'A9': { row: 10, col: 0 },
    'A10': { row: 10, col: 2 },

    // ZONE B/D (Mixed, Vertical Alignment - Start Row 12)
    'B1': { row: 12, col: 0 }, // 15x20
    'B2': { row: 12, col: 4 }, // 10x15
    'D1': { row: 12, col: 7 }, // 5x5
    'D2': { row: 14, col: 7 }, // ADDED D2 (10x15) - Placed directly below D1
    'D3': { row: 12, col: 9 }, // 15x15
    'B3': { row: 15, col: 0 }, // 15x20
    'D4': { row: 15, col: 5 }, // 5x5
    
    // ZONE C & G (Large, Bottom Area - Start Row 18)
    'C1': { row: 18, col: 13 }, // 20x20
    'C2': { row: 18, col: 8 }, // 20x20
    'G1': { row: 19, col: 0 }, // 10x15
    'G2': { row: 19, col: 3 }, // 10x15
    'G3': { row: 20, col: 6 }, // 5x5
    'G4': { row: 20, col: 7 }, // 5x5
    'G5': { row: 21, col: 0 }, // 10x10
    'G6': { row: 21, col: 3 }, // 10x15
};

// Helper function to interpret the dimensions string and map stall data
const mapStallsWithGridData = (apiStalls: any[]): Stall[] => {
    
    const getUnitSize = (dimensions: string): { widthUnits: number, heightUnits: number } => {
        const match = dimensions.match(/(\d+)\s*[xX]\s*(\d+)/);
        if (!match) return { widthUnits: 1, heightUnits: 1 };
        
        const width = parseInt(match[1], 10);
        const height = parseInt(match[2], 10);

        // Scale factor: 5 feet in reality = 1 grid unit on screen (30px)
        const scaleFactor = 5; 
        const widthUnits = Math.max(1, Math.round(width / scaleFactor));
        const heightUnits = Math.max(1, Math.round(height / scaleFactor));

        return { widthUnits, heightUnits };
    };

    return apiStalls
        .map(apiStall => {
            const positionProps = POSITION_MAP[apiStall.name];
            if (!positionProps) {
                return null; 
            }

            // Calculate proportional units from the backend's dimensions string
            const unitProps = getUnitSize(apiStall.dimensions || "5x5");

            return {
                id: apiStall.id,
                name: apiStall.name,
                size: apiStall.size as Stall['size'],
                price: apiStall.price,
                status: apiStall.status as Stall['status'],
                dimensions: apiStall.dimensions,
                ...positionProps,
                ...unitProps, // Inject dynamic units (widthUnits, heightUnits)
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
        // Fetch ALL stalls from backend (GET /stalls)
        const response = await axios.get("http://localhost:5000/stalls", {
            withCredentials: true // Ensure cookie is sent
        }); 
        
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
          // Use calculated rows/cols for dynamic grid size
          gridTemplateRows: `repeat(${rows}, 30px)`, // Row size adjusted for layout density
          gridTemplateColumns: `repeat(${cols}, 30px)`, // Column width adjusted
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
                backgroundColor: stall.status === "RESERVED" ? "#a0a0a0" : getStallColor(stall.status),
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
            <strong>Dimensions:</strong> {selected?.dimensions} <br />
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