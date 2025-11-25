import {
	Typography,
	useTheme,
	List,
	ListItem,
	styled,
	Grid,
	Box, // Added Box import
} from '@mui/material';
import {Link, useLocation} from 'react-router-dom'; // Added useLocation

const LinkContainer = styled(Link)(() => ({
	textDecoration: 'none',
	color: 'inherit',
	'&:hover': {
		textDecoration: 'underline',
	},
	padding: 0,
	display: 'block',
}));

export default function Footer() {
	const theme = useTheme();
	const location = useLocation(); // Get current location

	// Check if the current path is part of the admin portal
	const isAdminPath = location.pathname.startsWith('/admin') || location.pathname === '/';

	if (isAdminPath) {
		return (
			<Box
				sx={{
					borderTop: '1px solid black',
					paddingTop: '1.5rem',
					paddingBottom: '1rem',
					marginTop: '4rem',
					textAlign: 'center',
				}}
			>
				<Typography variant="body2" color="text.secondary">
					Organizer Control Panel | &copy; {new Date().getFullYear()} CIBF Stall Booking. All rights reserved.
				</Typography>
			</Box>
		);
	}

	// Default Footer (for Publisher/Public side)
	return (
		<Grid
			container
			sx={{
				flexDirection: {xs: 'column', sm: 'row'},
				borderTop: '1px solid black',
				paddingTop: '3rem',
			}}
		>
			<Grid
				container
				item
				sx={{padding: 0}}
				md={3}
				justifyContent="center"
				alignItems="center"
			>
				<Typography
					variant="h1"
					color={theme.palette.primary.main}
					fontSize={{xs: '2.25rem', md: '2.5rem'}}
					sx={{paddingBottom: {xs: '0.5rem', md: 0}}}
				>
					<LinkContainer
						to="/"
						style={{textDecoration: 'none', color: 'inherit'}}
					>
						CIBF - Stall Booking
					</LinkContainer>
				</Typography>
			</Grid>
			<Grid item md={9}>
				<Grid>
					<Grid
						container
						direction="row"
						justifyContent="center"
						sx={{paddingLeft: 0}}
					>
						<Grid item xs={4} sx={{paddingLeft: 0}}>
							<Typography sx={{textDecoration: 'underline'}} variant="h6">
								Useful Links
							</Typography>
							<List sx={{padding: 0}}>
								<LinkContainer to="/about" sx={{padding: 0}}>
									AboutUs
								</LinkContainer>
								<LinkContainer to="/privacy-policy" sx={{padding: 0}}>
									Privacy Policy
								</LinkContainer>
								<LinkContainer to="/terms-and-conditions" sx={{padding: 0}}>
									Terms & Conditions
								</LinkContainer>
							</List>
						</Grid>
						<Grid item xs={4} sx={{paddingLeft: 0}}>
							<Typography sx={{textDecoration: 'underline'}} variant="h6">
								Products
							</Typography>
							<List sx={{padding: 0}}>
								<LinkContainer to="/pricing" sx={{padding: 0}}>
									Pricing
								</LinkContainer>
							</List>
						</Grid>
						<Grid item xs={4} sx={{paddingLeft: 0}}>
							<Typography sx={{textDecoration: 'underline'}} variant="h6">
								Support
							</Typography>
							<List sx={{padding: 0}}>
								<LinkContainer to="/refund-policy" sx={{padding: 0}}>
									Refund Policy
								</LinkContainer>
								<LinkContainer to="/contactus" sx={{padding: 0}}>
									Contact Us
								</LinkContainer>
							</List>
						</Grid>
					</Grid>
				</Grid>
				<Grid
					container
					item
					spacing={2}
					padding={3}
					sx={{
						paddingLeft: 0,
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						[theme.breakpoints.down('sm')]: {
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
						},
						[theme.breakpoints.up('lg')]: {
							display: 'flex',
							justifyContent: 'flex-start',
						},
					}}
					alignItems="center"
				>

				</Grid>
			</Grid>
		</Grid>
	);
}