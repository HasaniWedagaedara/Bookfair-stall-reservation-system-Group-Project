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
  Menu, // ADDED: For QR download options
  MenuItem, // ADDED: For QR download options
} from '@mui/material';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import StorefrontIcon from '@mui/icons-material/Storefront';
import CategoryIcon from '@mui/icons-material/Category';
import DownloadIcon from '@mui/icons-material/Download'; // ADDED: For QR download icon
import EmailIcon from '@mui/icons-material/Email'; // ADDED: For email icon
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuthStore } from "../store/authStore";

// IMPORT MOCKS/UTILS (Assuming these are available in utils/qrCodeUtils)
// NOTE: I cannot write the content of these functions, but I'll define the required props.
import {
  downloadQRCodeAsImage,
  sendQRCodeToEmail,
  generateReservationPDF,
  // Define required ReservationData structure for utility functions
  // Note: This matches the extended Reservation type below.
  ReservationData, 
} from '../utils/qrCodeUtils'; 


type Reservation = {
  id: string;
  stallName: string;
  size: 'SMALL' | 'MEDIUM' | 'LARGE';
  qrCode: string;
  genres: string[] | null; 
  stallId: string;
  // ADDED: Fields required for PDF/Email generation utilities
  userEmail?: string;
  userName?: string;
  totalAmount?: number;
  reservationDate?: string;
};

// Key now includes reservation ID to allow multiple independent genre saves.
const getGenreStorageKey = (reservationId: string) => `STALL_GENRES_${reservationId}`; 

// --- FETCH LOGIC: Fetches ALL active reservations and calculates count ---
const fetchMyReservation = async (): Promise<{ activeReservations: Reservation[], count: number }> => {
  try {
    const response = await axios.get(
      "http://localhost:5000/reservations/my-reservations", 
      { withCredentials: true }
    );
    
    const reservations = response.data.reservations || [];
    
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

        // FIX 1: Read genres specifically for THIS reservation ID (Per-Stall Persistence)
        let genresData: string[] | null = null;
        const storedGenres = localStorage.getItem(getGenreStorageKey(res.id));

        if (storedGenres) {
            genresData = storedGenres.split(',').map((g: string) => g.trim());
        } else {
            // Fall back to actual API data or null if not found
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
            // Add fields required by QR utilities
            userEmail: res.user?.email,
            userName: res.user?.name,
            totalAmount: res.totalAmount,
            reservationDate: res.createdAt,
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
// NESTED COMPONENT: Manages genre state and submission for a single reservation
// ----------------------------------------------------
interface GenrePanelProps {
    reservation: Reservation;
    isMainReservation: boolean;
    onGenresSaved: (reservationId: string, genres: string[]) => void;
    // Props for QR menu handling
    handleQRButtonClick: (event: React.MouseEvent<HTMLButtonElement>, reservation: Reservation) => void;
    isDownloading: boolean;
    mainReservationId: string | undefined; // To control main CTA button visibility
}

const GenrePanel: React.FC<GenrePanelProps> = ({ 
    reservation, 
    isMainReservation, 
    onGenresSaved, 
    handleQRButtonClick, 
    isDownloading,
    mainReservationId
}) => {
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
                        disabled={isDownloading}
                        // Use prop handler for menu pop-up
                        onClick={(e) => handleQRButtonClick(e, reservation)}
                        startIcon={<DownloadIcon />}
                    >
                        {isDownloading ? 'Processing...' : 'Download Your QR Pass'}
                    </Button>
                </Paper>
            </Grid>
        </React.Fragment>
    );
};
// ----------------------------------------------------


const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeReservations, setActiveReservations] = useState<Reservation[]>([]); 
  const [isDownloading, setIsDownloading] = useState(false); // Global download flag
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // QR Menu anchor
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null); // QR Menu target
  const { user } = useAuthStore(); 
  
  const activeReservationCount = activeReservations.length;
  const mainReservationId = activeReservations[0]?.id; // Get ID of first reservation for CTA

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

  // --- QR/PDF/Email Handlers (Combined Logic) ---

  const handleQRButtonClick = (event: React.MouseEvent<HTMLButtonElement>, reservation: Reservation) => {
    setSelectedReservation(reservation);
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  // Helper to construct data for utility functions
  const buildReservationData = (res: Reservation): ReservationData => ({
    id: res.id,
    stallName: res.stallName,
    size: res.size,
    userEmail: res.userEmail || user?.email || 'user@example.com',
    userName: res.userName || user?.name || 'User',
    totalAmount: res.totalAmount,
    reservationDate: res.reservationDate,
    genres: res.genres || [],
  });

  const handleDownloadImage = async () => {
    handleMenuClose();
    if (!selectedReservation) return;

    setIsDownloading(true);
    try {
      await downloadQRCodeAsImage(buildReservationData(selectedReservation));
      toast.success(`Image downloaded for Stall ${selectedReservation.stallName}`);
    } catch (error) {
      toast.error('Failed to download QR image.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadPDF = async () => {
    handleMenuClose();
    if (!selectedReservation) return;

    setIsDownloading(true);
    try {
      await generateReservationPDF(buildReservationData(selectedReservation));
      toast.success(`PDF generated for Stall ${selectedReservation.stallName}`);
    } catch (error) {
      toast.error('Failed to download PDF.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSendEmail = async () => {
    handleMenuClose();
    if (!selectedReservation) return;

    setIsDownloading(true);
    try {
      await sendQRCodeToEmail(buildReservationData(selectedReservation));
      toast.success(`Email sent successfully for Stall ${selectedReservation.stallName}`);
    } catch (error) {
      toast.error('Failed to send email.');
    } finally {
      setIsDownloading(false);
    }
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
                        handleQRButtonClick={handleQRButtonClick} // Pass QR handlers
                        isDownloading={isDownloading}
                        mainReservationId={mainReservationId}
                    />
                    {/* Separator between reservations */}
                    {activeReservationCount > 1 && index < activeReservationCount - 1 && (
                        <Grid item xs={12}>
                            <Divider sx={{ my: 2 }} />
                        </Grid>
                    )}
                </React.Fragment>
            ))}
            
            {/* QR Download Menu (Placed outside the map to be global) */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              sx={{mt: 1}}
            >
              <MenuItem onClick={handleDownloadImage}>
                <DownloadIcon sx={{ mr: 1 }} />
                Download as Image
              </MenuItem>
              <MenuItem onClick={handleDownloadPDF}>
                <DownloadIcon sx={{ mr: 1 }} />
                Download as PDF
              </MenuItem>
              <MenuItem onClick={handleSendEmail}>
                <EmailIcon sx={{ mr: 1 }} />
                Send to Email
              </MenuItem>
            </Menu>
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