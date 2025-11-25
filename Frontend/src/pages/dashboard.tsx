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

// ADDED: Local Storage key for simulated persistence
const LOCAL_STORAGE_GENRE_KEY = "STALL_GENRES";

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

        // FIX 1: Safely read genres, prioritizing local storage data if the reservation is the FIRST one
        let genresData: string[] | null = null;
        const storedGenres = localStorage.getItem(LOCAL_STORAGE_GENRE_KEY);

        if (storedGenres && res.id === activeBackendReservations[0].id) {
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

const Dashboard = () => {
  const [genres, setGenres] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeReservations, setActiveReservations] = useState<Reservation[]>([]); // Store ALL active reservations
  const { user } = useAuthStore(); 
  
  // State helpers derived from activeReservations
  const mainReservation = activeReservations[0] || null;
  const activeReservationCount = activeReservations.length;

  useEffect(() => {
    fetchMyReservation().then((data) => {
      setActiveReservations(data.activeReservations); 
      setIsLoading(false);
      
      if (data.activeReservations[0] && data.activeReservations[0].genres) {
        setGenres(data.activeReservations[0].genres.join(', '));
      }
    });
  }, []);

  // FIXED: Now saves genres to localStorage to simulate backend persistence.
  const handleSaveGenres = async () => {
    if (!mainReservation) return;
    
    const genresArray = genres.split(',').map(g => g.trim()).filter(g => g.length > 0);
    const genresString = genresArray.join(',');

    // Save genres to localStorage to simulate persistence
    localStorage.setItem(LOCAL_STORAGE_GENRE_KEY, genresString);

    // Update local state by finding and updating the primary reservation
    setActiveReservations(prev => 
        prev.map((res, index) => 
            index === 0 ? { ...res, genres: genresArray } : res
        )
    );
    
    toast.success("Genres accepted! Actual submission to server is pending backend implementation.", { duration: 5000 });
  };
  
  // Renders the single reservation panel (reservation details and QR pass)
  const renderReservationPanel = (reservation: Reservation) => {
    // Determine if this is the reservation that requires genre input (first one, based on current logic)
    const needsGenreInput = reservation.id === mainReservation?.id && (reservation.genres === null || reservation.genres.length === 0);

    // SCENARIO 1: Show "Add Genre" form if needed for the main reservation
    if (needsGenreInput) {
      return (
        <Grid item xs={12} key={`input-${reservation.id}`}>
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
                value={genres}
                onChange={(e) => setGenres(e.target.value)}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveGenres}
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
            
            {/* Show Edit Genres button only if genres were previously saved (locally) 
               and if it's the main reservation */}
            {reservation.genres && reservation.genres.length > 0 && reservation.id === mainReservation?.id && (
                <Button
                    variant="text"
                    sx={{ mt: 2, mr: 2 }}
                    onClick={() => {
                        localStorage.removeItem(LOCAL_STORAGE_GENRE_KEY);
                        // Force update the state to re-render the input form
                        setActiveReservations(prev => 
                            prev.map((res, index) => 
                                index === 0 ? { ...res, genres: null } : res
                            )
                        );
                    }}
                >
                    Edit Genres
                </Button>
            )}

            {/* REMOVED: The "Book Another Stall" button is moved out of this Panel. */}
            
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
        
        {/* Separator between reservations */}
        {activeReservationCount > 1 && reservation.id !== activeReservations[activeReservations.length - 1].id && (
            <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
            </Grid>
        )}
      </React.Fragment>
    );
  };

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
    
    return activeReservations.map(renderReservationPanel);
  };
  
  // Renders the dedicated CTA button row
  const renderCtaRow = () => {
    // Show only if user has active reservations but is below the limit (max 3)
    if (activeReservationCount > 0 && activeReservationCount < 3) {
      return (
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 4 }}>
          <Button 
            variant="contained" 
            color="secondary" // Use secondary color to distinguish it
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
        
        {renderCtaRow()}

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