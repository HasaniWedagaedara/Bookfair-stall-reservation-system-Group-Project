import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import theme from "./theme";
import { Route, Routes, useLocation } from "react-router-dom";
import ValidateAuth from "./components/ValidateAuth";
import Navbar from "./components/navBar";
import Footer from "./components/footer";
import LandingPage from "./pages/landingPage";
import Dashboard from "./pages/dashboard";
import { Toaster } from "react-hot-toast";
import PricingPage from "./pages/PricingPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import RefundPolicy from "./pages/RefundPolicy";
import ContactUs from "./pages/contactUs";
import AboutUs from "./pages/AboutUs";
import FloorMapPage from "./pages/floormap";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";
import axios from "axios";
import LoginPage from "./pages/loginPage";
import RegisterPage from "./pages/registerPage";
import ProfilePage from "./pages/Profile";

function App() {
  const location = useLocation();
  const { setIsAuth, setUser } = useAuthStore();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/auth/me`,
          {
            withCredentials: true,
          }
        );

        if (response.status === 200 && response.data) {
          setIsAuth(true);
          setUser(response.data);
          console.log('User authenticated:', response.data);
        }
      } catch (error) {
        // User not logged in, clear any stale state
        console.log('Not authenticated');
        setIsAuth(false);
        setUser(null);
        localStorage.removeItem('user');
      }
    };

    checkAuth();
  }, [setIsAuth, setUser]);
  
  return (
    <>
      <ThemeProvider theme={theme}>
        <ValidateAuth />
        <CssBaseline />
        <Box margin={{ xs: "1rem", md: "3rem 5rem" }}>
          {!location.pathname.startsWith("/admin") &&
            location.pathname !== "/login" &&
            location.pathname !== "/register" && <Navbar />}
          <Routes>
            <Route path="/" element={<LandingPage />} />
            
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/map" element={<FloorMapPage />} />
            
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/about" element={<AboutUs />} />
            <Route
              path="/terms-and-conditions"
              element={<TermsAndConditions />}
            />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/contactus" element={<ContactUs />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
          {!location.pathname.startsWith("/admin") &&
            location.pathname !== "/login" &&
            location.pathname !== "/register" && <Footer />}
        </Box>
      </ThemeProvider>
      <Toaster />
    </>
  );
}

export default App;