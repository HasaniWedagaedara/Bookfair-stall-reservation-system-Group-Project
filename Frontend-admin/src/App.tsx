import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import theme from "./theme";
import { Route, Routes, useLocation } from "react-router-dom";
import GoogleAuthLogin from "./components/GoogleAuthLogin";
import ValidateAuth from "./components/ValidateAuth";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoginPage from "./pages/loginPage";
import RegisterPage from "./pages/user/registerPage";
import LandingPage from "./pages/adminLanding";
import Dashboard from "./pages/Dashboard";
import Checkout from "./pages/Checkout";
import Demopage from "./pages/demopage";
import { Toaster } from "react-hot-toast";
import AdminFloorMap from "./pages/adminFloorMap";
import PricingPage from "./pages/user/PricingPage/PricingPage";
import PrivacyPolicy from "./pages/about/PrivacyPolicy";
import TermsAndConditions from "./pages/about/TermsAndConditions";
import RefundPolicy from "./pages/about/RefundPolicy";
import ContactUs from "./pages/about/contactUs";
import AboutUs from "./pages/about/AboutUs";
import FloorMapPage from "./pages/user/floormap";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";
import axios from "axios";
import ProfilePage from "./pages/Profile";
import AdminDashBoard from "./pages/adminDashboard";
import AdminLandingPage from "./pages/adminLanding";

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

            <Route path="/google" element={<GoogleAuthLogin />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/about" element={<AboutUs />} />
            <Route
              path="/terms-and-conditions"
              element={<TermsAndConditions />}
            />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/contactus" element={<ContactUs />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/admin/dashboard" element={<AdminDashBoard />} />
            <Route path="/admin/floorMap" element={<AdminFloorMap />} />
            <Route path="/demo-Page" element={<Demopage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/adminLandingPage" element={<AdminLandingPage/>} />
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