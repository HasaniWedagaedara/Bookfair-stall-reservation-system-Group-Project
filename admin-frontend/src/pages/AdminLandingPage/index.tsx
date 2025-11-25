import React from 'react';
import { useTheme, Box, Button, Grid, Typography, styled, Stack } from "@mui/material"; 
import { useNavigate } from "react-router-dom";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import MapIcon from "@mui/icons-material/Map";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'; 


const AdminLandingPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  
  const handleCtaClick = () => {
    navigate("/admin/dashboard");
  };

  return (
    <Grid container direction="column" marginTop="2rem">
      <Grid item>
        <HeroContainer
          height={{ xs: "18rem", sm: "20rem", md: "28rem", lg: "34rem" }}
        >
          <Stack 
            direction="row" 
            alignItems="center" 
            justifyContent="center" 
            spacing={2} 
            maxWidth={{ xs: "90%", md: "70%" }}
            sx={{
              textShadow: '0 0 5px rgba(0,0,0,0.8)', 
            }}
          > 
            <AdminPanelSettingsIcon sx={{ fontSize: { xs: "3rem", md: "5rem" }, color: "white" }} /> 
            <Typography
              variant="h2"
              color="white"
              fontSize={{
                xs: "1.8rem",
                sm: "2.5rem",
                md: "3.0rem",
              }}
              textAlign="center"
              fontWeight="700"
            >
              Book Fair Organizer Portal: Manage Stalls & Reservations
            </Typography>
          </Stack>
          <Cta
            variant="contained"
            color="primary"
            onClick={handleCtaClick}
          >
            Access Live Dashboard
          </Cta>
        </HeroContainer>
        
        <Box marginBottom="4rem">
          <Typography
            variant="h2"
            color={theme.palette.secondary.main}
            fontWeight="700"
            margin="2rem 0"
            textAlign="center"
          >
            Organizer Tools
          </Typography>
          <Grid
            container
            spacing={{ xs: 4, md: 12 }}
            padding={{ md: "0 2rem" }}
            justifyContent="center"
          >
            {/* Card 1: Dashboard - for Reservations and Revenue */}
            <Grid item xs={12} md={5}>
              <Card onClick={() => navigate("/admin/dashboard")}>
                <AnalyticsIcon
                  sx={{ fontSize: "132px", color: "primary.main" }}
                />
                <Typography variant="h4" fontWeight="600" marginTop="1rem">
                  1. Manage Reservations & Sales
                </Typography>
                <Typography variant="body1" textAlign="center" color="text.secondary">
                    View and confirm publisher bookings
                </Typography>
              </Card>
            </Grid>

            {/* Card 2: Floor Map - for Stall Availability */}
            <Grid item xs={12} md={5}>
              <Card onClick={() => navigate("/admin/schedule")}>
                <MapIcon
                  sx={{ fontSize: "132px", color: "primary.main" }}
                />
                <Typography variant="h4" fontWeight="600" marginTop="1rem">
                  2. Live Stall Availability Map
                </Typography>
                <Typography variant="body1" textAlign="center" color="text.secondary">
                    See the interactive floor plan.
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};

// --- Styled Components ---

const HeroContainer = styled(Box)({
  backgroundColor: '#1C2833', 
  background: `linear-gradient(0deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5)), #1C2833`, 
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  backgroundPosition: "center",
  padding: "0 1rem",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: 42,
  marginBottom: "4rem",
  boxShadow: "0px 0px 16px rgba(0, 0, 0, 0.2)",
  cursor: 'pointer', 
});

const Cta = styled(Button)(({ theme }) => ({
  marginTop: "2.5rem",
  borderRadius: 8,
  padding: "0.5rem 2.5rem",
  width: "fit-content",
  fontWeight: "600",
  [theme.breakpoints.up("xs")]: {
    fontSize: "0.9rem",
  },
  [theme.breakpoints.up("sm")]: {
    fontSize: "1.1rem",
  },
  [theme.breakpoints.up("md")]: {
    fontSize: "1.2rem",
  },
  [theme.breakpoints.up("lg")]: {
    fontSize: "1.3rem",
  },
  "&:hover": {
    backgroundColor: "#FBBC05",
  },
}));

const Card = styled(Box)({
  display: "flex",
  flexDirection: "column",
  backgroundColor: "white",
  justifyContent: "center",
  gap: "1.5rem",
  alignItems: "center",
  boxShadow: "0px 0px 16px rgba(0, 0, 0, 0.2)",
  borderRadius: "15px",
  width: "100%",
  padding: "3rem 1rem",
  cursor: 'pointer',
  transition: 'transform 0.2s',
  '&:hover': {
      transform: 'translateY(-5px)',
  }
});

export default AdminLandingPage;