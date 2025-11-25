import React, { useState, useEffect } from "react";
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
    CircularProgress,
    Box,
    Button
} from "@mui/material";
import Navbar from "../components/navBar"; 
import Footer from "../components/footer"; // IMPORT FOOTER
import axios from 'axios';
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom"; 

// --- Interface Definitions ---
interface ReservationData {
    id: string;
    status: "PENDING" | "CONFIRMED" | "CANCELLED";
    totalAmount: number;
    createdAt: string;
    user: {
        name: string;
        email: string;
        businessName: string;
    };
    stall: { name: string };
}

interface StatsData {
    totalRevenue: number;
    byStatus: {
        confirmed: number;
        cancelled: number;
        pending: number;
    };
    stalls: {
        total: number;
        available: number;
    };
}

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
    const navigate = useNavigate();
    const [stats, setStats] = useState<StatsData | null>(null);
    const [reservations, setReservations] = useState<ReservationData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Fetch Reservation Statistics (GET /reservations/statistics)
                const statsResponse = await axios.get("http://localhost:5000/reservations/statistics", {
                    withCredentials: true
                });

                // 2. Fetch All Reservations (GET /reservations)
                const reservationsResponse = await axios.get("http://localhost:5000/reservations", {
                    withCredentials: true
                });
                
                // 3. Fetch Stall Statistics (GET /stalls/statistics)
                const stallStatsResponse = await axios.get("http://localhost:5000/stalls/statistics", {
                    withCredentials: true
                });

                // Combine data into a single state object
                setStats({
                    totalRevenue: statsResponse.data.totalRevenue,
                    byStatus: statsResponse.data.byStatus,
                    stalls: {
                        total: stallStatsResponse.data.total,
                        available: stallStatsResponse.data.byStatus.available,
                    },
                });

                setReservations(reservationsResponse.data.reservations || []);

            } catch (error) {
                console.error("Error fetching admin data:", error);
                toast.error("Failed to load dashboard data. Check API connection and Admin access.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const getChipColor = (status: ReservationData["status"]) => {
        if (status === "CONFIRMED") return "success";
        if (status === "CANCELLED") return "error";
        return "warning";
    };

    if (isLoading) {
        return (
            <>
                <Navbar />
                <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                        <CircularProgress />
                        <Typography sx={{ ml: 2 }}>Loading Admin Data...</Typography>
                    </Box>
                </Container>
                <Footer />
            </>
        );
    }
    
    // Fallback if data fetch fails
    if (!stats) {
        return (
            <>
                <Navbar />
                <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                    <Typography variant="h5" color="error">Failed to load dashboard data. Check API connection.</Typography>
                </Container>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar /> 
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom fontWeight={600}>
                    Admin Dashboard
                </Typography>

                {/* --- Navigation Bar for Admin Map --- */}
                <Box sx={{ mb: 4, display: 'flex', gap: 2 }}>
                    <Button 
                        variant="contained" 
                        color="primary"
                        onClick={() => navigate("/admin/floorMap")}
                    >
                        View Stall Map
                    </Button>
                    {/* Add other admin actions here */}
                </Box>

                {/* --- Statistic Cards --- */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            title="Total Revenue"
                            value={`Rs. ${stats.totalRevenue.toLocaleString()}`}
                            color="primary.main"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            title="Confirmed Reservations"
                            value={stats.byStatus.confirmed}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            title="Available Stalls"
                            value={`${stats.stalls.available} / ${stats.stalls.total}`}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            title="Cancelled Bookings"
                            value={stats.byStatus.cancelled}
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
                                {reservations.map((res) => (
                                    <TableRow hover key={res.id}>
                                        <TableCell>{res.user.name}</TableCell>
                                        <TableCell>{res.user.businessName}</TableCell>
                                        <TableCell>{res.stall.name}</TableCell>
                                        <TableCell>Rs. {res.totalAmount.toLocaleString()}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={res.status}
                                                color={getChipColor(res.status)}
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
            <Footer />
        </>
    );
};

export default AdminDashBoard;