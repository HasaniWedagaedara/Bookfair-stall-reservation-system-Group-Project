import { Routes, Route } from "react-router-dom";
import UserLogin from "./pages/UserLogin";
import AdminLogin from "./pages/AdminLogin";
import Home from "./pages/Home";
import { Box, ThemeProvider} from "@mui/material";
import theme from "./theme";

function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <Box margin={{ xs: "1rem", md: "3rem 5rem", lg: "3rem 10rem" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<UserLogin />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/dashboard"
              element={
                <div>
                  <h1>User Dashboard</h1>
                </div>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <div>
                  <h1>Admin Dashboard</h1>
                </div>
              }
            />
          </Routes>
        </Box>
      </ThemeProvider>
    </>
  );
}

export default App;
