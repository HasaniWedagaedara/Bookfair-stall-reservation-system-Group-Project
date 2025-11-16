import { Box, Button, Typography, styled } from "@mui/material";
import { useNavigate } from "react-router-dom";
import mainback from "../assets/mainback.jpg";
import AboutUs from "../components/AboutUs";

const Home = () => {
  const navigate = useNavigate();
  return (
    <Box marginTop="2rem">
      <HeroContainer
        height={{ xs: "18rem", sm: "20rem", md: "28rem", lg: "34rem" }}
      >
        <Typography
          variant="h2"
          color="white"
          fontSize={{ xs: "1.8rem", sm: "2.5rem", md: "3.3rem", lg: "3.6rem" }}
          maxWidth={{ xs: "90%", md: "60%" }}
          textAlign="center"
          fontWeight="700"
        >
          Stall Reservations for Publishers
        </Typography>
        <CTA
          variant="contained"
          color="primary"
          onClick={() => navigate("/bus-schedule")}
        >
          See Stalls
        </CTA>
      </HeroContainer>
      <Box marginBottom="4rem">
        <AboutUs />
      </Box>
    </Box>
  );
};

const HeroContainer = styled(Box)({
  background: `linear-gradient(0deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5)), url(${mainback})`,
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

const CTA = styled(Button)(({ theme }) => ({
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

export default Home;
