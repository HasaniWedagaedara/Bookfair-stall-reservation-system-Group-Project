import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import theme from "./theme";
import { Route, Routes, useLocation, Navigate } from "react-router-dom"; 
// Updated LandingPage import to the new AdminLandingPage
import AdminLandingPage from "./pages/AdminLandingPage"; 
import ValidateAuth from "./components/ValidateAuth";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminLoginPage from "./pages/AdminLogin";
import AdminDashBoard from "./pages/AdminDashBoard";
import AdminFloorMap from "./pages/AdminFloorMap";
import { Toaster } from "react-hot-toast";

function App() {
  const location = useLocation();

  // Determine if Navbar and Footer should be shown.
  // We only hide them on the admin login page for a cleaner UI.
  const hideNavFooter = location.pathname === "/admin/login";

  return (
    <>
      <ThemeProvider theme={theme}>
        <ValidateAuth />
        <CssBaseline />
        <Box margin={{ xs: "1rem", md: "3rem 5rem" }}>
          {!hideNavFooter && <Navbar />}
          <Routes>
            {/* Root path now points to the Admin Landing Page */}
            <Route path="/" element={<AdminLandingPage />} />
            
            {/* Admin Specific Routes */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin/dashboard" element={<AdminDashBoard />} />
            <Route path="/admin/schedule" element={<AdminFloorMap />} />
            
            {/* Catch-all route: redirects any unknown path back to the Admin Landing page */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          {!hideNavFooter && <Footer />}
        </Box>
      </ThemeProvider>
      <Toaster />
    </>
  );
}

export default App;