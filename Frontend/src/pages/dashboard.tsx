import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  Paper,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Grid, 
} from '@mui/material';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import StorefrontIcon from '@mui/icons-material/Storefront';
import CategoryIcon from '@mui/icons-material/Category';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuthStore } from "../store/authStore";


type Reservation = {
  id: string;
  stallName: string;
  size: 'SMALL' | 'MEDIUM' | 'LARGE';
  qrCode: string;
  genres: string[] | null; 
  stallId: string;
};

// Key now includes reservation ID to allow multiple independent genre saves.
const getGenreStorageKey = (reservationId: string) => `STALL_GENRES_${reservationId}`; 

// UPDATED: Function signature now returns both the main reservation and the count.
const fetchMyReservation = async (): Promise<{ activeReservations: Reservation[], count: number }> => {
  try {
    const response = await axios.get(
      "http://localhost:5000/reservations/my-reservations", 
      { withCredentials: true }
    );
    
    // Backend response format: { count: number, reservations: [] }
    const reservations = response.data.reservations || [];
    
    // Filter for CONFIRMED or PENDING reservations (avoiding CANCELLED)
    const activeBackendReservations = reservations.filter((res: any) => 
      res.status === 'CONFIRMED' || res.status === 'PENDING'
    );
    
    const count = activeBackendReservations.length; 

    if (count === 0) return { activeReservations: [], count: 0 };
    
    // Map all active reservations to the frontend Reservation type
    const mappedReservations: Reservation[] = activeBackendReservations.map((res: any) => {
        const stall = res.stall;
        const sizeString = stall?.size || 'SMALL';
        const stallSize = ['SMALL', 'MEDIUM', 'LARGE'].includes(sizeString) ? sizeString : 'SMALL';

        // FIX 1: Read genres specifically for THIS reservation ID
        let genresData: string[] | null = null;
        const storedGenres = localStorage.getItem(getGenreStorageKey(res.id));

        if (storedGenres) {
            genresData = storedGenres.split(',').map((g: string) => g.trim());
        } else {
            genresData = (res.genres && typeof res.genres === 'string') 
                            ? res.genres.split(',').map((g: string) => g.trim()) 
                            : null;
        }

        return {
            id: res.id,
            stallName: stall?.name || 'N/A', 
            size: stallSize as ('SMALL' | 'MEDIUM' | 'LARGE'),
            qrCode: res.qrCode || 'qr-data-string-default', 
            genres: genresData, 
            stallId: res.stallId,
        };
    });

    return { activeReservations: mappedReservations, count };

  } catch (error) {
    console.error("Error fetching reservations:", error);
    if (axios.isAxiosError(error) && error.response) {
      console.error("API Response Error:", error.response.data);
    }
    return { activeReservations: [], count: 0 };
  }
};


// ----------------------------------------------------
// NEW COMPONENT: Manages genre state and submission for a single reservation
// ----------------------------------------------------
interface GenrePanelProps {
    reservation: Reservation;
    isMainReservation: boolean;
    onGenresSaved: (reservationId: string, genres: string[]) => void;
}

const GenrePanel: React.FC<GenrePanelProps> = ({ reservation, isMainReservation, onGenresSaved }) => {
    // Local state for the text input for this specific panel
    const [genresInput, setGenresInput] = useState(reservation.genres?.join(', ') || '');
    const [isEditing, setIsEditing] = useState(reservation.genres === null || reservation.genres.length === 0);

    const handleSave = () => {
        const genresArray = genresInput.split(',').map(g => g.trim()).filter(g => g.length > 0);
        const genresString = genresArray.join(',');
        
        // Save genres to localStorage using reservation-specific key
        localStorage.setItem(getGenreStorageKey(reservation.id), genresString);

        // Notify parent component (Dashboard) to update its state
        onGenresSaved(reservation.id, genresArray);
        
        setIsEditing(false);

        toast.success(`Genres for Stall ${reservation.stallName} accepted! Submission to server pending.`, { duration: 5000 });
    };

    const handleEdit = () => {
        // Clear local storage for this reservation to simulate editing
        localStorage.removeItem(getGenreStorageKey(reservation.id));
        setGenresInput(reservation.genres?.join(', ') || '');
        onGenresSaved(reservation.id, []); // Clear genres in parent state temporarily
        setIsEditing(true);
    };

    // SCENARIO 1: Show "Add Genre" form
    if (isEditing) {
        return (
            <Grid item xs={12}>
                <Paper sx={{ p: 4, mb: 4 }}>
                    <Box>
                        <Typography variant="h6" gutterBottom>
                            Thank you for your reservation for Stall {reservation.stallName}!
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 3 }}>
                            Please add the literary genres you will be displaying at your
                            stall.
                        </Typography>
                        <TextField
                            label="Literary Genres (e.g., Fiction, Sci-Fi)"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={4}
                            sx={{ mb: 2 }}
                            value={genresInput}
                            onChange={(e) => setGenresInput(e.target.value)}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSave}
                        >
                            Save Genres
                        </Button>
                    </Box>
                </Paper>
            </Grid>
        );
    }
    
    // SCENARIO 2: Show the saved reservation and QR Pass side-by-side
    return (
        <React.Fragment key={reservation.id}>
            <Grid item xs={12} md={7}>
                <Paper sx={{ p: 3, height: '100%', borderRadius: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Stall {reservation.stallName} Details
                    </Typography>
                    <List disablePadding>
                        <ListItem disableGutters>
                            <ListItemIcon>
                                <StorefrontIcon color="primary" />
                            </ListItemIcon>
                            <ListItemText
                                primary="Stall"
                                secondary={`${reservation.stallName} (${reservation.size})`}
                            />
                        </ListItem>
                        {reservation.genres && (
                            <ListItem disableGutters>
                                <ListItemIcon>
                                    <CategoryIcon color="primary" />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Your Genres"
                                    secondary={reservation.genres.join(', ')}
                                />
                            </ListItem>
                        )}
                    </List>
                    
                    {/* Show Edit Genres button only if genres were previously saved (locally) */}
                    {reservation.genres && reservation.genres.length > 0 && (
                        <Button
                            variant="text"
                            sx={{ mt: 2, mr: 2 }}
                            onClick={handleEdit}
                        >
                            Edit Genres
                        </Button>
                    )}
                </Paper>
            </Grid>

            {/* --- Card 2: QR Pass (Call to Action) --- */}
            <Grid item xs={12} md={5}>
                <Paper
                    sx={{
                        p: 3,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        backgroundColor: 'secondary.main', 
                        color: 'white',
                        borderRadius: 2,
                    }}
                >
                    <QrCodeScannerIcon sx={{ fontSize: 60, mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                        Your Entry Pass (Stall {reservation.stallName})
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={() => console.log('Downloading pass...')}
                    >
                        Download Your QR Pass
                    </Button>
                </Paper>
            </Grid>
        </React.Fragment>
    );
};
// ----------------------------------------------------


const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeReservations, setActiveReservations] = useState<Reservation[]>([]); // Store ALL active reservations
  const { user } = useAuthStore(); 
  
  const activeReservationCount = activeReservations.length;

  useEffect(() => {
    fetchMyReservation().then((data) => {
      setActiveReservations(data.activeReservations); 
      setIsLoading(false);
    });
  }, []);

  // Handler to update the state of a specific reservation after genres are saved locally
  const handleGenresSaved = (reservationId: string, genres: string[]) => {
      setActiveReservations(prev => 
          prev.map(res => 
              res.id === reservationId ? { ...res, genres: genres } : res
          )
      );
  };
  
  // Renders the individual reservation panel (now using GenrePanel)
  const renderDashboardContent = () => {
    if (activeReservations.length === 0) {
      return (
        <Grid item xs={12}>
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6">
              You have no active reservations.
            </Typography>
            <Button variant="contained" sx={{ mt: 2 }} href="/pricing">
              Reserve a Stall
            </Button>
          </Paper>
        </Grid>
      );
    }
    
    return (
        <React.Fragment>
            {renderCtaRow()}
            {activeReservations.map((res, index) => (
                <React.Fragment key={res.id}>
                    <GenrePanel 
                        reservation={res} 
                        isMainReservation={index === 0}
                        onGenresSaved={handleGenresSaved}
                    />
                    {/* Separator between reservations */}
                    {activeReservationCount > 1 && index < activeReservationCount - 1 && (
                        <Grid item xs={12}>
                            <Divider sx={{ my: 2 }} />
                        </Grid>
                    )}
                </React.Fragment>
            ))}
        </React.Fragment>
    );
  };
  
  // Renders the dedicated CTA button row
  const renderCtaRow = () => {
    // Show only if user has active reservations but is below the limit (max 3)
    if (activeReservationCount > 0 && activeReservationCount < 3) {
      return (
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Button 
            variant="contained" 
            color="secondary" 
            size="large"
            href="/pricing"
          >
            BOOK ANOTHER STALL ({activeReservationCount}/3 RESERVED)
          </Button>
        </Grid>
      );
    }
    return null;
  };


  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" component="h1" fontWeight={600}>
            Welcome back, {user?.name || 'Partner'}!
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Here's your reservation overview.
          </Typography>
          <Divider sx={{ my: 2 }} />
        </Grid>
        
        {isLoading ? (
          <Grid item xs={12} sx={{ textAlign: 'center', my: 3, p: 4 }}>
            <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "50vh",
            }}
          >
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>Loading Your Dashboard...</Typography>
          </Box>
          </Grid>
        ) : (
          renderDashboardContent()
        )}
      </Grid>
    </Container>
  );
};

export default Dashboard;