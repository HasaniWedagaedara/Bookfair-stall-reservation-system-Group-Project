import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import theme from "./theme";
import { Route, Routes, useLocation } from "react-router-dom";
import GoogleAuthLogin from "./components/GoogleAuthLogin";
import ValidateAuth from "./components/ValidateAuth";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Checkout from "./pages/Checkout";
import Demopage from "./pages/DemoPage/demopage";
import { Toaster } from "react-hot-toast";
import AdminDashBoard from "./pages/AdminDashBoard";
import ProfilePage from "./pages/Profile";
import AdminSchedule from "./pages/AdminSchedule";
import NotFoundPage from "./pages/NotFoundPage";
import PricingPage from "./pages/PricingPage/PricingPage";
import PrivacyPolicy from "./pages/PrivacyPolicy/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndconditions/TermsAndConditions";
import RefundPolicy from "./pages/RefundPolicy/RefundPolicy";
import ContactUs from "./pages/ContactUs/contactUs";
import AboutUs from "./pages/AboutUs/AboutUs";
import FloorMapPage from "./pages/FloorMap/floormap";

function App() {
  const location = useLocation();
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
            <Route path="/admin/schedule" element={<AdminSchedule />} />
            <Route path="/demo-Page" element={<Demopage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<NotFoundPage />} />
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