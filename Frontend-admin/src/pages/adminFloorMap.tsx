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
import axios from "axios";
import toast from "react-hot-toast";
import Navbar from "../components/navBar"; 
import Footer from "../components/footer";

// --- Interface Definitions ---
interface AdminStall {
  id: string;
  name: string;
  size: "SMALL" | "MEDIUM" | "LARGE";
  location: string;
  dimensions: string;
  price: number;
  status: "AVAILABLE" | "RESERVED" | "MAINTENANCE";
  reservedByBusiness: string | null; 
  reservedByEmail: string | null;
  reservedByName: string | null; 
  
  // Grid properties (Calculated dynamically)
  widthUnits: number;
  heightUnits: number;
  row: number;
  col: number;
}

// --- HARDCODED POSITIONING MAP (FIXED FOR EXPANDED LAYOUT) ---
// This map assigns unique starting coordinates (row/col) to 30+ stalls.
const POSITION_MAP: { [key: string]: Pick<AdminStall, 'row' | 'col'> } = {
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
    'B1': { row: 12, col: 0 }, 
    'B2': { row: 12, col: 4 }, 
    'D1': { row: 12, col: 7 }, 
    'D2': { row: 14, col: 7 }, 
    'D3': { row: 12, col: 9 }, 
    'B3': { row: 15, col: 0 }, 
    'D4': { row: 15, col: 5 }, 
    
    // ZONE C & G (Large, Bottom Area - Start Row 18)
    'C1': { row: 18, col: 13 }, 
    'C2': { row: 18, col: 8 }, 
    'G1': { row: 19, col: 0 }, 
    'G2': { row: 19, col: 3 }, 
    'G3': { row: 20, col: 6 }, 
    'G4': { row: 20, col: 7 }, 
    'G5': { row: 21, col: 0 }, 
    'G6': { row: 21, col: 3 }, 
};

// Helper function to interpret the dimensions string and map stall data
const mapStallsWithGridData = (apiStalls: any[], reservations: any[]): AdminStall[] => {
    
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
    
    // Index reservations by stallId for fast lookup
    const reservationMap = new Map();
    reservations.forEach(res => {
        reservationMap.set(res.stallId, { 
            name: res.user?.name,
            businessName: res.user?.businessName,
            email: res.user?.email,
        }); 
    });

    return apiStalls
        .map(apiStall => {
            const positionProps = POSITION_MAP[apiStall.name];
            if (!positionProps) {
                return null; 
            }

            const unitProps = getUnitSize(apiStall.dimensions || "5x5");
            const reservedInfo = reservationMap.get(apiStall.id);

            return {
                id: apiStall.id,
                name: apiStall.name,
                size: apiStall.size as AdminStall['size'],
                location: apiStall.location,
                dimensions: apiStall.dimensions,
                price: apiStall.price,
                status: apiStall.status as AdminStall['status'],
                reservedByName: reservedInfo?.name || null, 
                reservedByBusiness: reservedInfo?.businessName || null,
                reservedByEmail: reservedInfo?.email || null,
                ...positionProps,
                ...unitProps, 
            } as AdminStall;
        })
        .filter((stall): stall is AdminStall => stall !== null);
};

const AdminFloorMap: React.FC = () => {
  const [stalls, setStalls] = useState<AdminStall[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState<AdminStall | null>(null);

  useEffect(() => {
    const fetchAdminMapData = async () => {
      try {
        // 1. Fetch ALL stalls (GET /stalls)
        const stallResponse = await axios.get("http://localhost:5000/stalls", {
            withCredentials: true
        });
        
        // 2. Fetch ALL Reservations (GET /reservations)
        const reservationResponse = await axios.get("http://localhost:5000/reservations", {
            withCredentials: true
        });

        const apiStalls = stallResponse.data.stalls || [];
        const allReservations = reservationResponse.data.reservations || [];

        const mappedStalls = mapStallsWithGridData(apiStalls, allReservations);
        
        setStalls(mappedStalls);
      } catch (error) {
        console.error("Failed to fetch admin map data:", error);
        toast.error("Failed to load map data. Authentication or API error.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminMapData();
  }, []);

  const handleClick = (stall: AdminStall) => {
    setSelected(stall);
  };

  const handleClose = () => setSelected(null);

  const getStallColor = (status: AdminStall["status"]) => {
    if (status === "RESERVED") return "#a0a0a0";
    if (status === "MAINTENANCE") return "#f5a623";
    return "#4682B4"; 
  };
  
  if (isLoading) {
    return (
        <>
            <Navbar />
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
              <CircularProgress />
              <Typography sx={{ ml: 2 }}>Loading Admin Floor Map...</Typography>
            </Box>
        </>
    );
  }

  const rows = Math.max(1, ...stalls.map((s) => s.row + s.heightUnits)) + 1;
  const cols = Math.max(1, ...stalls.map((s) => s.col + s.widthUnits)) + 1;

  return (
    <>
      <Navbar />
      <Container sx={{ py: 4, mb: 6 }}>
        <Typography variant="h3" align="center" gutterBottom>
          Admin - Stall Availability Map
        </Typography>
        <Typography
          variant="body1"
          align="center"
          color="textSecondary"
          paragraph
        >
          Click any stall for status and details.
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateRows: `repeat(${rows}, 30px)`, 
            gridTemplateColumns: `repeat(${cols}, 30px)`, 
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

        <Dialog open={!!selected} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogTitle>Stall {selected?.name} - Details</DialogTitle>
          <DialogContent>
            <DialogContentText component={"div"} sx={{ color: "text.primary" }}>
              <strong>Status:</strong> {selected?.status} <br />
              <strong>Size:</strong> {selected?.size} <br />
              <strong>Price:</strong> Rs. {selected?.price?.toLocaleString()} <br />
              <strong>Dimensions:</strong> {selected?.dimensions}
              
              {selected?.status === "RESERVED" && (
                <Box component="div" sx={{ mt: 1, p: 1, border: '1px solid #ccc', borderRadius: 1 }}>
                  <Typography component="span" fontWeight="bold">
                    Reserved By:
                  </Typography>
                  <br/>
                  <Typography component="span" fontWeight="bold">
                    {selected?.reservedByName} 
                  </Typography>
                  <br />
                  <Typography variant="caption" color="text.secondary">
                    Business: {selected?.reservedByBusiness}
                  </Typography>
                  <br />
                  <Typography variant="caption" color="text.secondary">
                    Email: {selected?.reservedByEmail}
                  </Typography>
                </Box>
              )}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
          </DialogActions>
        </Dialog>
      </Container>
      <Footer />
    </>
  );
};

export default AdminFloorMap;