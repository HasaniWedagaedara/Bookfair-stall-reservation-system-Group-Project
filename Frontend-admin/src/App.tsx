import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import theme from "./theme";
import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/navBar";
import Footer from "./components/footer";
import LoginPage from "./pages/loginPage";
import { Toaster } from "react-hot-toast";
import AdminFloorMap from "./pages/adminFloorMap";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";
import axios from "axios";
import ProfilePage from "./pages/Profile";
import AdminDashBoard from "./pages/adminDashboard";
import ValidateAuth from "./components/ValidateAuth";
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
            <Route path="/" element={<AdminLandingPage />} />

            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin/dashboard" element={<AdminDashBoard />} />
            <Route path="/admin/floorMap" element={<AdminFloorMap />} />
            <Route path="/admin/profile" element={<ProfilePage />} />
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