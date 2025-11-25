import { Button, Container, Grid, Typography, Box, Divider, Dialog, DialogTitle, DialogContent, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, IconButton,CircularProgress, } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close'; // Import Close icon
import PricingCard from '../components/PricingCards';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

// Interface for individual stalls (as received from API)
interface Stall {
  id: string;
  name: string;
  size: string;
  price: number;
  idealFor: string;
  features: string;
  // ADDED: dimensions field from the backend model
  dimensions: string; 
}

// Interface for category cards (what we will render)
interface CategoryCard {
    name: string;
    size: string;
    price: string;
    idealFor: string;
    features: string;
    isAvailable: boolean; // New flag for availability
    availableCount: number; // New flag for count
}

const ALL_STALL_SIZES = ['SMALL', 'MEDIUM', 'LARGE'];

// Custom sorter to display cards in S, M, L order
const sortCategories = (a: CategoryCard, b: CategoryCard): number => {
  const sizeOrder = { 'SMALL': 1, 'MEDIUM': 2, 'LARGE': 3 };
  const sizeA = sizeOrder[a.size.toUpperCase() as keyof typeof sizeOrder] || 4;
  const sizeB = sizeOrder[b.size.toUpperCase() as keyof typeof sizeOrder] || 4;
  return sizeA - sizeB;
};

// Custom sorter for individual stalls (Alphabetical by name)
const sortStallsAlphabetically = (a: Stall, b: Stall): number => {
  return a.name.localeCompare(b.name);
};


const PricingPage = () => {
  const navigate = useNavigate(); 
  const [categories, setCategories] = useState<CategoryCard[]>([]);
  const [allAvailableStalls, setAllAvailableStalls] = useState<Stall[]>([]); // Store ALL stalls
  const [loading, setLoading] = useState(true);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSizeStalls, setSelectedSizeStalls] = useState<Stall[]>([]);
  const [selectedSize, setSelectedSize] = useState<string>('');


  // Helper function to provide more descriptive features based on size
  const getDescriptiveFeatures = (size: string, features: string): string => {
    let descriptiveList: string[] = [];
    
    switch (size.toUpperCase()) {
      case 'SMALL':
        descriptiveList = [`Size: ${size}`, 'Approx. 10ft x 10ft', 'Standard Power Outlet', `Ideal for: ${features}`];
        break;
      case 'MEDIUM':
        descriptiveList = [`Size: ${size}`, 'Approx. 15ft x 15ft', 'Standard Furniture Pack', 'Priority Aisle Location', `Ideal for: ${features}`];
        break;
      case 'LARGE':
        descriptiveList = [`Size: ${size}`, 'Approx. 25ft x 25ft', 'Full Customization Options', 'Premium Visibility Area', `Ideal for: ${features}`];
        break;
      default:
        descriptiveList = [`Features: ${features}`];
    }
    return descriptiveList.join('\n');
  };

  // NEW HANDLER: Triggers the modal with specific stalls
  const handleViewStallsClick = (size: string) => {
    const stallsInSize = allAvailableStalls
      .filter(stall => stall.size.toUpperCase() === size.toUpperCase())
      .sort(sortStallsAlphabetically); // Alphabetical sort required
      
    setSelectedSizeStalls(stallsInSize);
    setSelectedSize(size);
    setOpenDialog(true);
  };
  
  // NEW HANDLER: Closes the modal and navigates to the map
  const handleMapNavigation = () => {
      setOpenDialog(false);
      navigate("/map");
  }


  useEffect(() => {
    const fetchAndGroupStalls = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/stalls/available" // Fetch ONLY available stalls
        ); 
        
        const fetchedStalls: Stall[] = response.data.stalls || [];
        setAllAvailableStalls(fetchedStalls); // Store all available stalls

        const categoryMap = new Map<string, { minPrice: number, count: number, features: Stall }>();

        // 1. Group stalls by size, find min price, and count available stalls
        for (const stall of fetchedStalls) {
            const stallSize = stall.size.toUpperCase();
            
            const isPriceLower = stall.price < (categoryMap.get(stallSize)?.minPrice ?? Infinity);

            if (!categoryMap.has(stallSize)) {
                categoryMap.set(stallSize, {
                    minPrice: stall.price,
                    count: 1,
                    features: stall, 
                });
            } else {
                const current = categoryMap.get(stallSize)!;
                categoryMap.set(stallSize, {
                    minPrice: isPriceLower ? stall.price : current.minPrice,
                    count: current.count + 1,
                    features: current.features,
                });
            }
        }

        const finalCategories: CategoryCard[] = [];

        // 2. Iterate over ALL_STALL_SIZES for consistency (S, M, L)
        for (const size of ALL_STALL_SIZES) {
            const data = categoryMap.get(size);

            if (data) {
                // Category AVAILABLE
                finalCategories.push({
                    // FIXED: Removed 'Stalls' suffix
                    name: size, 
                    size: size,
                    price: `Starts at Rs. ${data.minPrice.toLocaleString()}`, 
                    idealFor: `Available Stalls: ${data.count} | Ideal for: ${data.features.idealFor}`, 
                    features: getDescriptiveFeatures(size, data.features.features), 
                    isAvailable: true,
                    availableCount: data.count,
                });
            } else {
                // Category NOT AVAILABLE
                finalCategories.push({
                    // FIXED: Removed 'Stalls' suffix
                    name: size, 
                    size: size,
                    // FIXED: Only show "SOLD OUT" as price string for unavailable stalls
                    price: `SOLD OUT`, 
                    idealFor: "No stalls of this size are currently available for booking.",
                    features: "Please check the floor map for reserved/maintenance status.",
                    isAvailable: false,
                    availableCount: 0,
                });
            }
        }
        
        const sortedCategories = [...finalCategories].sort(sortCategories);
        setCategories(sortedCategories);

      } catch (error) {
        console.error("Error fetching stalls:", error);
        toast.error("Could not load stall pricing categories.");
        setCategories(ALL_STALL_SIZES.map(size => ({
            name: `${size} Stalls`,
            size: size,
            price: `API Error`,
            idealFor: "Failed to fetch status from server.",
            features: "Please try refreshing.",
            isAvailable: false,
            availableCount: 0,
        })));
      } finally {
        setLoading(false);
      }
    };

    fetchAndGroupStalls();
  }, []);

if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading stall categories...</Typography>
      </Box>
    );
  }
  
  if (categories.length === 0) {
      return (
          <Box sx={{ py: 8, textAlign: 'center' }}>
              <Typography variant="h4" color="textPrimary">Stall Configuration Error</Typography>
              <Typography variant="h6" color="textSecondary" sx={{ mt: 2 }}>No stall sizes (Small, Medium, Large) defined. Contact Admin.</Typography>
          </Box>
      );
  }


  return (
    <Container sx={{ py: 8 }}>
      <Typography variant="h2" align="center" gutterBottom>
        Stall Pricing Plans
      </Typography>
      <Typography variant="h5" align="center" color="textSecondary" paragraph>
        Choose the stall size that best fits your needs at the Colombo
        International Book Fair. Prices may vary based on location on the floor map.
      </Typography>
      
      <Grid container spacing={4} justifyContent="center">
        {categories.map((category, index) => (
          <Grid
            item
            key={category.size}
            xs={12}
            sm={6}
            md={4}
            style={{
              transition: "transform 0.3s ease-in-out",
              opacity: category.isAvailable ? 1 : 0.6,
            }}
          >
            <PricingCard
              name={category.name}
              price={category.price}
              Size={category.size} 
              idealFor={category.idealFor} 
              features={category.features} 
              isAvailable={category.isAvailable} 
              onViewStallsClick={handleViewStallsClick} 
            />
          </Grid>
        ))}
      </Grid>

      <Grid container justifyContent="center" sx={{ mt: 6 }}>
        <Divider sx={{ width: '80%', mb: 3 }}/>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          onClick={handleMapNavigation}
        >
          View & Select Stall on Floor Map
        </Button>
      </Grid>
      
      {/* Modal/Dialog to show detailed available stalls */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="lg" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5">Available {selectedSize} Stalls ({selectedSizeStalls.length})</Typography>
                <IconButton onClick={() => setOpenDialog(false)} sx={{ ml: 1, color: 'text.secondary' }}>
                    <CloseIcon />
                </IconButton>
        </DialogTitle>
        <DialogContent dividers>
            <TableContainer component={Paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Stall Name</TableCell>
                            <TableCell>Dimensions</TableCell> 
                            <TableCell>Price</TableCell>
                            <TableCell>Ideal For</TableCell>
                            <TableCell>Features</TableCell>
                            <TableCell align="right">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {selectedSizeStalls.map((stall) => (
                            <TableRow key={stall.id} hover>
                                <TableCell sx={{ fontWeight: 'bold' }}>{stall.name}</TableCell>
                                <TableCell>{stall.dimensions}</TableCell> 
                                <TableCell>Rs. {stall.price.toLocaleString()}</TableCell>
                                <TableCell>{stall.idealFor}</TableCell>
                                <TableCell>{stall.features}</TableCell>
                                <TableCell align="right">
                                    <Button 
                                        variant="outlined" 
                                        size="small"
                                        onClick={handleMapNavigation} 
                                    >
                                        Go to Map
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default PricingPage;