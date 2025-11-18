import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import theme from "./theme";
import { Route, Routes, useLocation } from "react-router-dom";
import GoogleAuthLogin from "./components/GoogleAuthLogin";
import ValidateAuth from "./components/ValidateAuth";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoginPage from "./pages/userAdmin/loginPage";
import RegisterPage from "./pages/user/registerPage";
import LandingPage from "./pages/userAdmin/landingPage";
import Dashboard from "./pages/Dashboard";
import Checkout from "./pages/Checkout";
import Demopage from "./pages/DemoPage/demopage";
import { Toaster } from "react-hot-toast";
import AdminDashBoard from "./pages/admin/adminDashboard";
import ProfilePage from "./pages/userAdmin/Profile";
import AdminFloorMap from "./pages/admin/adminFloorMap";
import PricingPage from "./pages/user/PricingPage/PricingPage";
import PrivacyPolicy from "./pages/userAdmin/PrivacyPolicy";
import TermsAndConditions from "./pages/userAdmin/TermsAndConditions";
import RefundPolicy from "./pages/userAdmin/RefundPolicy";
import ContactUs from "./pages/userAdmin/contactUs";
import AboutUs from "./pages/userAdmin/AboutUs";
import FloorMapPage from "./pages/FloorMap/floormap";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";
import axios from "axios";

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
            <Route path="/admin/floorMap" element={<AdminFloorMap/>} />
            <Route path="/demo-Page" element={<Demopage />} />
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