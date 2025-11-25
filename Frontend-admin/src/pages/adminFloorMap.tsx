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
import Footer from "../components/footer"; // IMPORT FOOTER

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
  
  // Grid properties (injected on frontend, as per previous discussion)
  widthUnits: number;
  heightUnits: number;
  row: number;
  col: number;
}

// --- HARDCODED GRID DATA MAP (Essential for rendering map layout) ---
const GRID_DATA_MAP: { [key: string]: Pick<AdminStall, 'widthUnits' | 'heightUnits' | 'row' | 'col'> } = {
  'A1': { row: 3, col: 1, widthUnits: 1, heightUnits: 1 },
  'A2': { row: 3, col: 2, widthUnits: 1, heightUnits: 1 },
  'B1': { row: 5, col: 3, widthUnits: 2, heightUnits: 2 }, 
  'D1': { row: 5, col: 5, widthUnits: 1, heightUnits: 1 }, 
  'C1': { row: 7, col: 7, widthUnits: 3, heightUnits: 3 }, 
  'E1': { row: 0, col: 0, widthUnits: 3, heightUnits: 2 },
  'E2': { row: 0, col: 3, widthUnits: 3, heightUnits: 2 },
  'E3': { row: 0, col: 6, widthUnits: 3, heightUnits: 2 },
  'A5': { row: 4, col: 0, widthUnits: 2, heightUnits: 2 },
};

// Helper function to map backend data to the full AdminStall interface
const mapStallsWithGridData = (apiStalls: any[], reservations: any[]): AdminStall[] => {
    // Index reservations by stallId for fast lookup
    const reservationMap = new Map();
    reservations.forEach(res => {
        // NOTE: The backend API /reservations MUST include the nested user object {user: {name, businessName, email}}
        reservationMap.set(res.stallId, { 
            name: res.user?.name,
            businessName: res.user?.businessName,
            email: res.user?.email,
        }); 
    });

    return apiStalls
        .map(apiStall => {
            const gridProps = GRID_DATA_MAP[apiStall.name];
            if (!gridProps) {
                return null; 
            }
            
            // Find reservation user details
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
                ...gridProps,
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

        // Map backend data + grid properties
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
    return "#4682B4"; // Available
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
      <Navbar /> {/* Use the shared Navbar */}
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
                  {/* Display Contact Person Name */}
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