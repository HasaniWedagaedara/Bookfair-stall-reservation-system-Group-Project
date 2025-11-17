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

const useMockAuthStore = () => ({
  user: {
    name: 'Akura Publisher',
    email: 'Akura@example.com',
    businessName: 'Bookworm Creations',
    phone: '0771234567',
    picture: '',
  },
  logout: () => {
    console.log('Logging out...');
  },
});

const ProfilePage = () => {
  const { user, logout } = useMockAuthStore();
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    name: user.name,
    businessName: user.businessName,
    phone: user.phone,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    console.log('Saving profile...', form);
    setIsEditing(false);
  };

  return (
    <Container maxWidth="md" sx={{ mb: 6 }}>
      <Paper sx={{ p: 4, mt: 4, borderRadius: 2, boxShadow: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ width: 80, height: 80, mr: 2, bgcolor: 'primary.main' }}>
              <BusinessIcon sx={{ fontSize: 40 }} />
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight={600}>
                {form.businessName}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                {user.email}
              </Typography>
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
              label="Contact Person Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              disabled={!isEditing}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Business Name"
              name="businessName"
              value={form.businessName}
              onChange={handleChange}
              disabled={!isEditing}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Phone Number"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              disabled={!isEditing}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Email"
              name="email"
              value={user.email}
              disabled
              fullWidth
              sx={{ '& .MuiInputBase-root': { backgroundColor: '#f5f5f5' } }}
            />
          </Grid>

          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
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
              onClick={logout}
              sx={{ ml: 'auto' }}
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