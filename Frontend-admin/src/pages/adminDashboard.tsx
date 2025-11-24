import React from "react";
import {
  Container,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";
import Navbar from "../components/Navbar";

// --- Mock Data ---
const mockStats = {
  reservations: {
    revenue: 1250000,
    confirmed: 35,
    cancelled: 4,
  },
  stalls: {
    total: 50,
    available: 15,
  },
};

const mockReservations = [
  {
    id: "res-1",
    status: "CONFIRMED",
    totalAmount: 40000,
    createdAt: "2025-11-10T09:00:00Z",
    user: {
      name: "Sajani Perera",
      email: "sajani@example.com",
      businessName: "Bookworm Creations",
    },
    stall: { name: "E1" },
  },
  {
    id: "res-2",
    status: "PENDING",
    totalAmount: 15000,
    createdAt: "2025-11-11T14:30:00Z",
    user: {
      name: "Hasani Wedagedara",
      email: "hasani@example.com",
      businessName: "Readers Corner",
    },
    stall: { name: "A3" },
  },
  {
    id: "res-3",
    status: "CANCELLED",
    totalAmount: 25000,
    createdAt: "2025-11-09T11:00:00Z",
    user: {
      name: "Telana Samarasekara",
      email: "telana@example.com",
      businessName: "Samara Books",
    },
    stall: { name: "B2" },
  },
];
// ---

// Helper component for stat cards
const StatCard = ({
  title,
  value,
  color,
}: {
  title: string;
  value: string | number;
  color?: string;
}) => (
  <Paper sx={{ p: 2, textAlign: "center", height: "100%" }}>
    <Typography variant="h6" color={color || "text.secondary"}>
      {title}
    </Typography>
    <Typography variant="h4" fontWeight={600}>
      {value}
    </Typography>
  </Paper>
);

const AdminDashBoard = () => {
  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight={600}>
          Admin Dashboard
        </Typography>

        {/* --- Statistic Cards --- */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Revenue"
              value={`Rs. ${mockStats.reservations.revenue.toLocaleString()}`}
              color="primary.main"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Confirmed Reservations"
              value={mockStats.reservations.confirmed}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Available Stalls"
              value={`${mockStats.stalls.available} / ${mockStats.stalls.total}`}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Cancelled Bookings"
              value={mockStats.reservations.cancelled}
            />
          </Grid>
        </Grid>

        {/* --- Reservations Table --- */}
        <Typography variant="h5" component="h2" gutterBottom fontWeight={600}>
          All Reservations
        </Typography>
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Publisher</TableCell>
                  <TableCell>Business Name</TableCell>
                  <TableCell>Stall</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockReservations.map((res) => (
                  <TableRow hover key={res.id}>
                    <TableCell>{res.user.name}</TableCell>
                    <TableCell>{res.user.businessName}</TableCell>
                    <TableCell>{res.stall.name}</TableCell>
                    <TableCell>Rs. {res.totalAmount}</TableCell>
                    <TableCell>
                      <Chip
                        label={res.status}
                        color={
                          res.status === "CONFIRMED"
                            ? "success"
                            : res.status === "CANCELLED"
                            ? "error"
                            : "warning"
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(res.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
    </>
  );
};

export default AdminDashBoard;
