import { useTheme, Box, Button, Grid, Typography, styled } from "@mui/material";
import bgimg from "../assets/bgimg.jpg";
import { useNavigate } from "react-router-dom";

const AdminLandingPage = () => {
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
            marginBottom={{ xs: "2rem", md: "3rem" }}
          >
            Manage Stalls at the Colombo International Book Fair
          </Typography>

          <ButtonContainer>
            <Cta
              variant="contained"
              color="primary"
              onClick={() => navigate("/admin/dashboard")}
            >
              View Dashboard
            </Cta>
            <Cta
              variant="contained"
              color="primary"
              onClick={() => navigate("/admin/floorMap")}
            >
              See Available Stalls
            </Cta>
          </ButtonContainer>
        </HeroContainer>
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

const ButtonContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: "1.5rem",
  flexWrap: "wrap",
  justifyContent: "center",
  alignItems: "center",
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    gap: "1rem",
    width: "100%",
  },
}));

const Cta = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  padding: "0.75rem 2rem",
  fontWeight: "600",
  textTransform: "none",
  boxShadow: "0px 4px 12px rgba(251, 188, 5, 0.3)",
  transition: "all 0.3s ease",
  [theme.breakpoints.up("xs")]: {
    fontSize: "0.95rem",
    minWidth: "200px",
  },
  [theme.breakpoints.up("sm")]: {
    fontSize: "1.1rem",
    minWidth: "220px",
  },
  [theme.breakpoints.up("md")]: {
    fontSize: "1.15rem",
    minWidth: "240px",
  },
  [theme.breakpoints.up("lg")]: {
    fontSize: "1.2rem",
    minWidth: "260px",
  },
  "&:hover": {
    backgroundColor: "#FBBC05",
    transform: "translateY(-2px)",
    boxShadow: "0px 6px 16px rgba(251, 188, 5, 0.4)",
  },
  "&:active": {
    transform: "translateY(0px)",
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

export default AdminLandingPage;
