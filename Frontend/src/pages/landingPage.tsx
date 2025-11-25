import { useTheme, Box, Button, Grid, Typography, styled } from "@mui/material";
import bgimg from "../assets/bgimg.jpg";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import StorefrontIcon from "@mui/icons-material/Storefront";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  return (
    <Grid container direction="column" marginTop="2rem">
      <Grid item>
        <HeroContainer
          height={{ xs: "18rem", sm: "20rem", md: "28rem", lg: "34rem" }}
        >
          <Typography
            variant="h2"
            color="white"
            fontSize={{
              xs: "1.8rem",
              sm: "2.5rem",
              md: "3.0rem",
            }}
            maxWidth={{ xs: "90%", md: "60%" }}
            textAlign="center"
            fontWeight="700"
          >
            Reserve Your Stall at the Colombo International Book Fair
          </Typography>
          <Cta
            variant="contained"
            color="primary"
            onClick={() => navigate("/login")}
          >
            View Stall Pricing
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
            How to Reserve
          </Typography>
          <Grid
            container
            spacing={{ xs: 4, md: 12 }}
            padding={{ md: "0 2rem" }}
          >
            <Grid item xs={12} md={4}>
              <Card>
                <HowToRegIcon
                  sx={{ fontSize: "132px", color: "primary.main" }}
                />
                <Typography variant="h4" fontWeight="600" marginTop="1rem">
                  1. Register Your Business
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card onClick={() => navigate("/map")} sx={{ cursor: "pointer" }}>
                <StorefrontIcon
                  sx={{ fontSize: "132px", color: "primary.main" }}
                />
                <Typography variant="h4" fontWeight="600" marginTop="1rem">
                  2. Select Your Stall
                </Typography>
              </Card>
            </Grid>


            <Grid item xs={12} md={4}>
              <Card>
                <QrCodeScannerIcon
                  sx={{ fontSize: "132px", color: "primary.main" }}
                />
                <Typography variant="h4" fontWeight="600" marginTop="1r_e_m">
                  3. Confirm & Get Your Pass
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};

const HeroContainer = styled(Box)({
  background: `linear-gradient(0deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5)), url(${bgimg})`,
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
});

export default LandingPage;