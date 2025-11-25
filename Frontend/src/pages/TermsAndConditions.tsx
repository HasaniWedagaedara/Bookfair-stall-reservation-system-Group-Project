import React from 'react';
import { Container, Typography, Box, Link } from '@mui/material';
import TermsAndPolicy_1 from '../assets/termsAndPolicy_1.avif';
import TermsAndPolicy_2 from '../assets/termsAndPolicy_2.avif';
import TermsAndPolicy_3 from '../assets/termsAndPolicy_3.jpg';

const styles = {
  container: {
    padding: '32px',
    backgroundColor: '#ffffff',
    color: '#000000',
    marginTop: '16px',
  },
  section: {
    marginBottom: '24px',
  },
  list: {
    paddingLeft: '20px',
  },
  image: {
    maxWidth: '20rem',
    height: 'auto',
    marginBottom: '2rem',
  },
};

const TermsAndConditions = () => {
  return (
    <Box bgcolor="#ffffff" mt="3rem">
      <Container maxWidth="lg">
        {/* ========== FIRST SECTION ========== */}
        <Box
          pt="4rem"
          display="flex"
          flexDirection={{ xs: 'column-reverse', md: 'row' }}
          alignItems="center"
        >
          <Box flex="1">
            <Typography variant="h2" style={{ marginBottom: '3rem' }} gutterBottom>
              Terms and Conditions
            </Typography>

            <Typography variant="body2" paragraph>
              These Terms and Conditions govern your use of the Stall Booking System
              provided by the Colombo International Book Fair (CIBF). By registering for,
              accessing, or using the system, you agree to comply with these Terms.  
              If you do not agree, please do not use the Service.
            </Typography>

            <Typography variant="h5" component="h2">
              Interpretation and Definitions
            </Typography>

            <div style={styles.section}>
              <Typography variant="body2" paragraph>
                Words with capitalized initials have specific meanings under the
                following conditions. The same definitions apply whether terms appear in
                singular or plural form.
              </Typography>
              <Typography variant="body2" paragraph>
                “Service” refers to the online stall booking platform operated by the
                <strong> Sri Lanka Book Publishers Association </strong> for the
                Colombo International Book Fair, accessible at{' '}
                <Link
                  href="https://colombobookfair.lk/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://colombobookfair.lk/
                </Link>
                .
              </Typography>
            </div>
          </Box>

          <Box flex="1" textAlign="center" sx={{ marginBottom: { xs: '3rem', md: 0 } }}>
            <img src={TermsAndPolicy_1} alt="Book Fair Terms" style={styles.image} />
          </Box>
        </Box>

        {/* ========== SECOND SECTION ========== */}
        <Box
          py="4rem"
          display="flex"
          flexDirection={{ xs: 'column-reverse', md: 'row-reverse' }}
          alignItems="center"
        >
          <Box flex="1">
            <Typography variant="h3" component="h2" gutterBottom>
              Use of Service
            </Typography>

            <Typography variant="body2" paragraph>
              Access to the Stall Booking System is granted for the purpose of reserving,
              managing, and paying for stalls at the Colombo International Book Fair.  
              The Service is intended for exhibitors, publishers, and official partners.
            </Typography>

            <Typography variant="body2" paragraph>
              By using this Service, you agree not to:
            </Typography>
            <ul style={styles.list}>
              <li>
                <Typography variant="body2">
                  Submit false or misleading information during stall booking.
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  Interfere with or disrupt the platform’s security or functionality.
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  Attempt to gain unauthorized access to other users’ data or bookings.
                </Typography>
              </li>
            </ul>

            <Typography variant="body2" paragraph>
              The organizers reserve the right to suspend or terminate any account that
              violates these Terms or engages in fraudulent or disruptive activity.
            </Typography>

            <Typography variant="body2" paragraph>
              You are granted a non-exclusive, non-transferable, revocable license to use
              the Service strictly in accordance with these Terms.
            </Typography>
          </Box>

          <Box flex="1" textAlign="center" mb={{ xs: '2rem', md: 0 }}>
            <img src={TermsAndPolicy_2} alt="Service Use" style={styles.image} />
          </Box>
        </Box>

        {/* ========== THIRD SECTION ========== */}
        <Box
          py="4rem"
          display="flex"
          flexDirection={{ xs: 'column-reverse', md: 'row' }}
          alignItems="center"
        >
          <Box flex="1">
            <Typography variant="h3" component="h2" gutterBottom>
              Exhibitor Responsibilities
            </Typography>

            <Typography variant="body2" paragraph>
              Exhibitors are responsible for maintaining the accuracy of their booking
              details, payment information, and contact credentials. Each exhibitor must
              ensure compliance with fair guidelines and any applicable regulations.
            </Typography>

            <Typography variant="body2" paragraph>
              You must not share your account credentials with third parties or use the
              system for purposes other than stall booking and management.
            </Typography>

            <Typography variant="body2" paragraph>
              You agree to:
            </Typography>
            <ul style={styles.list}>
              <li>
                <Typography variant="body2">
                  Keep your login credentials secure and confidential.
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  Immediately notify the organizers of any unauthorized account access.
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  Comply with all stall regulations, payment timelines, and fair safety
                  policies.
                </Typography>
              </li>
            </ul>

            <Typography variant="body2" paragraph>
              Failure to comply may result in the cancellation of your stall reservation
              and forfeiture of any fees paid.
            </Typography>
          </Box>

          <Box flex="1" textAlign="center">
            <img src={TermsAndPolicy_3} alt="Exhibitor Guidelines" style={styles.image} />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default TermsAndConditions;
