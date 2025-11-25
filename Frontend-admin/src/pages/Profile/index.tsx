import React, { useState } from 'react';
import {
  Typography,
  Box,
  Button,
  Container,
  Paper,
  Grid,
  TextField,
  Avatar,
  Divider,
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useAuthStore } from '../../store/authStore';


const ProfilePage = () => {
  const { user, setIsAuth, setUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isAdmin = user?.role === "admin";

  const [form, setForm] = useState({
    name: user?.name || "",
    businessName: user?.businessName || "",
    mobileNumber: user?.mobileNumber || "",
  });

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    setError("");
    setLoading(true);

    try {
      // Build the update payload based on role
      const updateData = isAdmin
        ? { name: form.name }
        : {
            name: form.name,
            businessName: form.businessName,
            mobileNumber: form.mobileNumber,
          };

      const response = await fetch(
        "http://localhost:5000/auth/update-profile",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(updateData),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to update profile");
      }

      const updatedUser = await response.json();
      console.log("Profile updated:", updatedUser);

      // Update store and localStorage
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setIsEditing(false);
    } catch (err) {
      console.error("Update error:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to update profile");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
      // Close menu first
      setAnchorEl(null);
  
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/auth/logout`,
          {
            withCredentials: true,
          }
        );
  
        if (response.status === 200) {
          // Clear auth store
          setIsAuth(false);
          setUser(null);
  
          // Clear any stored data in localStorage
          localStorage.removeItem("user");
          localStorage.removeItem("authToken");
  
          // Show success message
          toast.success("Logged out successfully", {
            position: "top-center",
            duration: 2000,
          });
  
          // Redirect after showing toast
          setTimeout(() => {
            window.location.replace("/");
          }, 500);
        }
      } catch (error) {
        console.error("Logout error:", error);
  
        // Even if backend fails, clear frontend state
        setIsAuth(false);
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("authToken");
  
        toast.error("Session ended", {
          position: "top-center",
          duration: 2000,
        });
  
        setTimeout(() => {
          window.location.replace("/");
        }, 500);
      }
    };
  

  return (
    <Container maxWidth="md" sx={{ mb: 6 }}>
      <Paper sx={{ p: 4, mt: 4, borderRadius: 2, boxShadow: 3 }}>
        <Grid container spacing={3}>
          <Grid
            item
            xs={12}
            sx={{ display: "flex", alignItems: "center", mb: 2 }}
          >
            <Avatar
              sx={{ width: 80, height: 80, mr: 2, bgcolor: "primary.main" }}
            >
              <BusinessIcon sx={{ fontSize: 40 }} />
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight={600}>
                {isAdmin ? "Administrator" : user?.businessName}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                {user?.email || ""}
              </Typography>
              {isAdmin && (
                <Typography variant="body2" color="error" sx={{ mt: 0.5 }}>
                  Admin Account
                </Typography>
              )}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom>
              Profile Details
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label={isAdmin ? "Administrator Name" : "Contact Person Name"}
              name="name"
              value={user?.name}
              onChange={handleChange}
              disabled={!isEditing || loading}
              fullWidth
            />
          </Grid>

          {!isAdmin && (
            <>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Business Name"
                  name="businessName"
                  value={user?.businessName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Phone Number"
                  name="phone"
                  value={user?.mobileNumber}
                  onChange={handleChange}
                  disabled={!isEditing}
                  fullWidth
                />
              </Grid>
            </>
          )}

          <Grid item xs={12} md={6}>
            <TextField
              label="Email"
              name="email"
              value={user?.email || ""}
              disabled
              fullWidth
              sx={{ "& .MuiInputBase-root": { backgroundColor: "#f5f5f5" } }}
            />
          </Grid>

          <Grid
            item
            xs={12}
            sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}
          >
            {isEditing ? (
              <>
                <Button variant="outlined" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button variant="contained" onClick={handleSave}>
                  Save Changes
                </Button>
              </>
            ) : (
              <Button variant="contained" onClick={() => setIsEditing(true)}>
                Edit Details
              </Button>
            )}
            <Button
              variant="contained"
              color="error"
              onClick={handleLogout}
              sx={{ ml: "auto" }}
            >
              Logout
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ProfilePage;