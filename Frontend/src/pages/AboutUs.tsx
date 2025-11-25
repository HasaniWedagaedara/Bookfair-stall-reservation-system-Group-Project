import {
  Container,
  Typography,
  ThemeProvider,
  Box,
} from '@mui/material';
import {useTheme} from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import aboutUsImage from '../assets/about-us.png';
import ourMissionImage from '../assets/our-mission.jpg';
import ourStoryImage from '../assets/our-story.jpg';

const AboutUs = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const styles = {
    image: {
      width: isSmallScreen ? '24rem' : '32rem',
      borderRadius: '8px',
      marginBottom: '2rem',
    },
  };
  
  return (
    <ThemeProvider theme={theme}>
      <Box bgcolor="#ffffff" pb="4rem" mt="3rem">
        <Container maxWidth="lg">
          {/* About Us Section */}
          <Box
            py="4rem"
            display="flex"
            flexDirection={{xs: 'column-reverse', md: 'row'}}
            alignItems="center"
          >
            <Box flex="1">
              <Typography variant="h3" component="h2" gutterBottom>
                About Us
              </Typography>
              <Typography variant="body1">
                Welcome to the Colombo International Book Fair Stall Booking System. 
                Our platform streamlines the process of booking exhibition stalls, 
                helping publishers, authors, and book enthusiasts reserve their 
                spots quickly and efficiently. We aim to make participation in the 
                book fair hassle-free while promoting engagement among all attendees.
              </Typography>
            </Box>
            <Box flex="1" textAlign="center">
              <img src={aboutUsImage} alt="About Us" style={styles.image} />
            </Box>
          </Box>

          {/* Our Story Section */}
          <Box
            py="4rem"
            display="flex"
            flexDirection={{xs: 'column-reverse', md: 'row-reverse'}}
            alignItems="center"
          >
            <Box flex="1">
              <Typography variant="h3" component="h2" gutterBottom>
                Our Story
              </Typography>
              <Typography variant="body1">
                The Colombo International Book Fair is one of the largest literary 
                events in Sri Lanka. Organizing and booking stalls for the fair 
                used to be a cumbersome process involving manual registrations 
                and long queues. In 2025, our team developed a centralized online 
                stall booking system to simplify the experience for exhibitors and 
                visitors alike. Since its launch, hundreds of stalls have been 
                booked seamlessly, allowing the focus to shift from paperwork to 
                promoting literature and cultural exchange.
              </Typography>
            </Box>
            <Box flex="1" textAlign="center" mb={{xs: '2rem', md: 0}}>
              <img src={ourStoryImage} alt="Our Story" style={styles.image} />
            </Box>
          </Box>

          {/* Our Mission Section */}
          <Box
            py="4rem"
            display="flex"
            flexDirection={{xs: 'column-reverse', md: 'row'}}
            alignItems="center"
          >
            <Box flex="1">
              <Typography variant="h3" component="h2" gutterBottom>
                Our Mission: Simplifying Stall Booking
              </Typography>
              <Typography variant="body1">
                Our mission is to eliminate the stress of booking exhibition stalls 
                for the Colombo International Book Fair. Through our platform, 
                exhibitors can check availability, reserve stalls, and manage 
                their bookings online, saving valuable time and effort. We aim to 
                enhance the fair experience for both organizers and participants 
                by making stall management transparent, fast, and convenient.
              </Typography>
            </Box>
            <Box flex="1" textAlign="center">
              <img
                src={ourMissionImage}
                alt="Our Mission"
                style={styles.image}
              />
            </Box>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default AboutUs;
