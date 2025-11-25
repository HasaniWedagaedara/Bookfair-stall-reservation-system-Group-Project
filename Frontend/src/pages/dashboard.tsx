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
  Menu,
  MenuItem,
} from '@mui/material';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import StorefrontIcon from '@mui/icons-material/Storefront';
import CategoryIcon from '@mui/icons-material/Category';
import DownloadIcon from '@mui/icons-material/Download';
import EmailIcon from '@mui/icons-material/Email';
import {
  generateQRCodeCanvas,
  downloadQRCodeAsImage,
  sendQRCodeToEmail,
  generateReservationPDF,
  ReservationData,
} from '../../utils/qrCodeUtils';
import toast from 'react-hot-toast';

const useMockAuthStore = () => ({
  user: {
    name: 'Akura', 
  },
});
// ---

type Reservation = {
  id: string;
  stallName: string;
  size: 'SMALL' | 'MEDIUM' | 'LARGE';
  qrCode: string;
  genres: string[] | null;
  userEmail?: string;
  userName?: string;
  totalAmount?: number;
  reservationDate?: string;
};

// Mock API call
const fetchMyReservation = (): Promise<Reservation> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: 'res-123',
        stallName: 'A5',
        size: 'SMALL',
        qrCode: 'qr-data-string-123',
        genres: ['Fiction', 'Sci-Fi'],
        userEmail: 'testuser@example.com',
        userName: 'Akura',
        totalAmount: 5000,
        reservationDate: new Date().toISOString(),
      });
      // ---
    }, 1500);
  });
};

const Dashboard = () => {
  const [genres, setGenres] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [myReservation, setMyReservation] = useState<Reservation | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user } = useMockAuthStore(); 

  useEffect(() => {
    fetchMyReservation().then((data) => {
      setMyReservation(data);
      setIsLoading(false);
    });
  }, []);

  const handleSaveGenres = async () => {
    console.log("Saving genres:", genres);
    setMyReservation({
      ...myReservation!,
      genres: genres.split(',').map(g => g.trim()),
    });
  };

  const handleQRButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDownloadImage = async () => {
    handleMenuClose();
    if (!myReservation) return;

    setIsDownloading(true);
    try {
      const reservationData: ReservationData = {
        id: myReservation.id,
        stallName: myReservation.stallName,
        size: myReservation.size,
        userEmail: myReservation.userEmail || 'user@example.com',
        userName: myReservation.userName || user.name,
        totalAmount: myReservation.totalAmount,
        reservationDate: myReservation.reservationDate,
        genres: myReservation.genres || [],
      };

      await downloadQRCodeAsImage(reservationData);
    } catch (error) {
      console.error('Error downloading QR:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadPDF = async () => {
    handleMenuClose();
    if (!myReservation) return;

    setIsDownloading(true);
    try {
      const reservationData: ReservationData = {
        id: myReservation.id,
        stallName: myReservation.stallName,
        size: myReservation.size,
        userEmail: myReservation.userEmail || 'user@example.com',
        userName: myReservation.userName || user.name,
        totalAmount: myReservation.totalAmount,
        reservationDate: myReservation.reservationDate,
        genres: myReservation.genres || [],
      };

      await generateReservationPDF(reservationData);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSendEmail = async () => {
    handleMenuClose();
    if (!myReservation) return;

    setIsDownloading(true);
    try {
      const reservationData: ReservationData = {
        id: myReservation.id,
        stallName: myReservation.stallName,
        size: myReservation.size,
        userEmail: myReservation.userEmail || 'user@example.com',
        userName: myReservation.userName || user.name,
        totalAmount: myReservation.totalAmount,
        reservationDate: myReservation.reservationDate,
        genres: myReservation.genres || [],
      };

      await sendQRCodeToEmail(reservationData);
    } catch (error) {
      console.error('Error sending email:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const renderContent = () => {
    if (myReservation === null) {
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

    // SCENARIO 1: Show "Add Genre" form
    if (myReservation.genres === null) {
      return (
        <Grid item xs={12}>
          <Paper sx={{ p: 4 }}>
            <Box>
              <Typography variant="h6" gutterBottom>
                Thank you for your reservation!
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

    // SCENARIO 2: Show the saved reservation (NEW DESIGN)
    return (
      <>
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3, height: '100%', borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Your Reservation Details
            </Typography>
            <List disablePadding>
              <ListItem disableGutters>
                <ListItemIcon>
                  <StorefrontIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Stall"
                  secondary={`${myReservation.stallName} (${myReservation.size})`}
                />
              </ListItem>
              <ListItem disableGutters>
                <ListItemIcon>
                  <CategoryIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Your Genres"
                  secondary={myReservation.genres.join(', ')}
                />
              </ListItem>
            </List>
            <Button
              variant="text"
              sx={{ mt: 2 }}
              onClick={() => setMyReservation({ ...myReservation, genres: null })}
            >
              Edit Genres
            </Button>
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
              Your Entry Pass
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              disabled={isDownloading}
              onClick={handleQRButtonClick}
              startIcon={<DownloadIcon />}
            >
              {isDownloading ? 'Processing...' : 'Download Your QR Pass'}
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
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
          </Paper>
        </Grid>
      </>
    );
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" component="h1" fontWeight={600}>
            Welcome back, {user.name}!
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Here's your reservation overview.
          </Typography>
          <Divider sx={{ my: 2 }} />
        </Grid>

        {isLoading ? (
          <Grid item xs={12} sx={{ textAlign: 'center', my: 3, p: 4 }}>
            <CircularProgress />
            <Typography sx={{ mt: 2 }}>Loading Your Dashboard...</Typography>
          </Grid>
        ) : (
          renderContent()
        )}
      </Grid>
    </Container>
  );
};

export default Dashboard;