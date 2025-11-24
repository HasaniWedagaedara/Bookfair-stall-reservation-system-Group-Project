import React from 'react';
import { Container, Typography, Box, Link } from '@mui/material';
import TermsAndPolicy_1 from '../../assets/termsAndPolicy_1.avif';
import TermsAndPolicy_2 from '../../assets/termsAndPolicy_2.avif';
import TermsAndPolicy_3 from '../../assets/termsAndPolicy_3.jpg';

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

const RefundPolicy = () => {
  return (
    <Box bgcolor="#ffffff" mt="3rem">
      <Container maxWidth="lg">
        {/* ===== Section 1 ===== */}
        <Box
          pt="4rem"
          display="flex"
          flexDirection={{ xs: 'column-reverse', md: 'row' }}
          alignItems="center"
        >
          <Box flex="1">
            <Typography
              variant="h2"
              style={{ marginBottom: '3rem' }}
              gutterBottom
            >
              Refund Policy
            </Typography>
            <Typography variant="body2" paragraph>
              This Refund Policy outlines the terms and conditions under which
              refunds are granted for tickets, stall reservations, and
              registrations for the{' '}
              <strong>Colombo International Book Fair (CIBF)</strong>. We
              encourage all visitors, participants, and exhibitors to read this
              policy carefully before completing any purchase.
            </Typography>
            <Typography variant="h5" component="h2">
              Eligibility for Refund
            </Typography>
            <div style={styles.section}>
              <Typography variant="body2" paragraph>
                Refunds are available only for advance ticket purchases or stall
                reservations made through the official CIBF website or authorized
                partners.
              </Typography>
              <Typography variant="body2" paragraph>
                Refund requests must be submitted within{' '}
                <strong>7 days</strong> of the original purchase date, and no
                later than <strong>48 hours</strong> before the event start date.
              </Typography>
              <Typography variant="body2" paragraph>
                Refunds will not be issued for partially attended events,
                no-shows, or cancellations made after the specified deadline.
              </Typography>
            </div>
          </Box>

          <Box
            flex="1"
            textAlign="center"
            sx={{ marginBottom: { xs: '3rem', md: 0 } }}
          >
            <img
              src={TermsAndPolicy_1}
              alt="Refund Illustration"
              style={styles.image}
            />
          </Box>
        </Box>

        {/* ===== Section 2 ===== */}
        <Box
          py="4rem"
          display="flex"
          flexDirection={{ xs: 'column-reverse', md: 'row-reverse' }}
          alignItems="center"
        >
          <Box flex="1">
            <Typography variant="h3" component="h2" gutterBottom>
              How to Request a Refund
            </Typography>
            <Typography variant="body2" paragraph>
              To request a refund, please contact the official CIBF support team
              via email at{' '}
              <Link
                href="mailto:support@colombobookfair.lk"
                target="_blank"
                rel="noopener noreferrer"
              >
                support@colombobookfair.lk
              </Link>
              . Include your order reference number, payment details, and a brief
              reason for the refund request.
            </Typography>
            <Typography variant="body2" paragraph>
              Once we receive your refund request, our accounts department will
              verify the transaction and may contact you for additional details.
            </Typography>
            <Typography variant="body2" paragraph>
              Approved refunds will be processed within{' '}
              <strong>5–10 business days</strong> and returned via the original
              payment method used for the transaction.
            </Typography>
            <Typography variant="body2" paragraph>
              Please note that service fees or third-party platform charges may
              not be refundable.
            </Typography>
          </Box>

          <Box flex="1" textAlign="center" mb={{ xs: '2rem', md: 0 }}>
            <img
              src={TermsAndPolicy_2}
              alt="Refund Process"
              style={styles.image}
            />
          </Box>
        </Box>

        {/* ===== Section 3 ===== */}
        <Box
          py="4rem"
          display="flex"
          flexDirection={{ xs: 'column-reverse', md: 'row' }}
          alignItems="center"
        >
          <Box flex="1">
            <Typography variant="h3" component="h2" gutterBottom>
              Customer Support
            </Typography>
            <Typography variant="body2" paragraph>
              Our team is available to assist you with any inquiries related to
              payments, ticketing, or refund requests. You can reach us at{' '}
              <Link
                href="mailto:support@colombobookfair.lk"
                target="_blank"
                rel="noopener noreferrer"
              >
                support@colombobookfair.lk
              </Link>{' '}
              or by phone at <strong>+94 11 234 5678</strong>.
            </Typography>
            <Typography variant="body2" paragraph>
              We aim to provide a prompt and fair resolution for all refund
              requests in accordance with this policy.
            </Typography>
            <Typography variant="body2" paragraph>
              Thank you for your understanding and continued support of the
              Colombo International Book Fair.
            </Typography>
          </Box>

          <Box flex="1" textAlign="center">
            <img
              src={TermsAndPolicy_3}
              alt="Support Team"
              style={styles.image}
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default RefundPolicy;
