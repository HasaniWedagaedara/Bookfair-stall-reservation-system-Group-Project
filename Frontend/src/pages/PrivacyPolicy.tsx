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

const PrivacyPolicy = () => {
  return (
    <Box bgcolor="#ffffff" mt="3rem">
      <Container maxWidth="lg">
        {/* ================= FIRST SECTION ================= */}
        <Box
          pt="4rem"
          display="flex"
          flexDirection={{ xs: 'column-reverse', md: 'row' }}
          alignItems="center"
        >
          <Box flex="1">
            <Typography variant="h2" style={{ marginBottom: '3rem' }} gutterBottom>
              Privacy Policy
            </Typography>
            <Typography variant="body2" paragraph>
              This Privacy Policy explains how we collect, use, and protect your personal
              information when you use the Colombo International Book Fair Stall Booking
              System (the “Service”). It also describes your privacy rights and how you can
              manage your data.
            </Typography>
            <Typography variant="body2" paragraph>
              We use your information to process stall bookings, manage event participation,
              and improve the overall fair experience. By using this platform, you agree to
              the terms outlined in this Privacy Policy.
            </Typography>
            <Typography variant="body2" paragraph>
              Visit the official portal at{' '}
              <Link
                href="https://colombobookfair.lk/"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://colombobookfair.lk/
              </Link>
              .
            </Typography>

            <Typography variant="h5" component="h2">
              Interpretation and Definitions
            </Typography>
            <div style={styles.section}>
              <Typography variant="body2" paragraph>
                Words with capitalized initials have specific meanings under the following
                conditions. The definitions below apply whether terms appear in singular or
                plural form.
              </Typography>
            </div>
          </Box>
          <Box flex="1" textAlign="center" sx={{ marginBottom: { xs: '3rem', md: 0 } }}>
            <img src={TermsAndPolicy_1} alt="Book Fair Privacy" style={styles.image} />
          </Box>
        </Box>

        {/* ================= SECOND SECTION ================= */}
        <Box
          py="4rem"
          display="flex"
          flexDirection={{ xs: 'column-reverse', md: 'row-reverse' }}
          alignItems="center"
        >
          <Box flex="1">
            <Typography variant="h3" component="h2" gutterBottom>
              Definitions
            </Typography>
            <Typography variant="body2" paragraph>
              For the purposes of this Privacy Policy:
            </Typography>
            <Typography variant="body1">
              <ul style={styles.list}>
                <li>
                  <Typography variant="body2">
                    <strong>Account</strong> means a unique account created for you to access
                    the Stall Booking System or related services.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    <strong>Affiliate</strong> refers to an organization or partner
                    collaborating with the Colombo International Book Fair organizing
                    committee.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    <strong>Organizer</strong> (referred to as "We", "Us" or "Our") means the
                    Sri Lanka Book Publishers Association, responsible for managing the
                    Colombo International Book Fair.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    <strong>Cookies</strong> are small data files stored on your device to
                    enhance user experience, remember preferences, and enable secure login.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    <strong>Event Location</strong> refers to the BMICH, Colombo, Sri Lanka.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    <strong>Device</strong> means any device that can access the Service,
                    such as a computer, mobile phone, or tablet.
                  </Typography>
                </li>
              </ul>
            </Typography>
          </Box>
          <Box flex="1" textAlign="center" mb={{ xs: '2rem', md: 0 }}>
            <img src={TermsAndPolicy_2} alt="Fair Definition" style={styles.image} />
          </Box>
        </Box>

        {/* ================= THIRD SECTION ================= */}
        <Box
          py="4rem"
          display="flex"
          flexDirection={{ xs: 'column-reverse', md: 'row' }}
          alignItems="center"
        >
          <Box flex="1">
            <Typography variant="h3" component="h2" gutterBottom>
              Key Terms
            </Typography>
            <Typography variant="body2" paragraph>
              The following key terms are used throughout this Privacy Policy:
            </Typography>
            <Typography variant="body1">
              <ul style={styles.list}>
                <li>
                  <Typography variant="body2">
                    <strong>Personal Data</strong> means any information that can be used to
                    identify an exhibitor, visitor, or organizer, such as name, contact
                    number, or email address.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    <strong>Service</strong> refers to the Colombo International Book Fair
                    Stall Booking System.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    <strong>Service Provider</strong> means any third-party company or
                    individual that processes data on behalf of the organizer, including
                    payment gateways and hosting services.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    <strong>Usage Data</strong> refers to information collected automatically
                    when using the Service, such as pages visited, session duration, and
                    browser type.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    <strong>Website</strong> refers to the Colombo International Book Fair
                    Stall Booking Portal, accessible from{' '}
                    <Link
                      href="https://colombobookfair.lk/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      https://colombobookfair.lk/
                    </Link>
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    <strong>User</strong> means any individual or organization using the
                    Stall Booking System, including exhibitors, publishers, or fair
                    organizers.
                  </Typography>
                </li>
              </ul>
            </Typography>
          </Box>
          <Box flex="1" textAlign="center">
            <img src={TermsAndPolicy_3} alt="Book Fair Policy" style={styles.image} />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default PrivacyPolicy;
