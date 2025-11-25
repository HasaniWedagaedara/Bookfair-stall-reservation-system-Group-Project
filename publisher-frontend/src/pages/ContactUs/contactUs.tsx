import { Box, CardContent, Grid, styled, Typography } from '@mui/material';
import help from '../../assets/contactushelp.svg';
import call from '../../assets/contactuscall.svg';
import email from '../../assets/contactusemail.svg';
import coverimage from '../../assets/coverimage.jpg';

const ContactUs = () => {
  return (
    <>
      {/* Background Image */}
      <Box marginLeft={{ xs: '-1rem', sm: '-1rem', md: '-5rem', lg: '-5rem' }}>
        <img
          src={coverimage}
          alt="Book Fair Cover"
          style={{
            paddingTop: '1rem',
            position: 'absolute',
            width: '100vw',
            height: 'auto',
            zIndex: '-1',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </Box>

      {/* Title Section */}
      <ContactUsStyle>
        <Typography
          variant={'h1'}
          fontSize={{ xs: '2rem', sm: '2.5rem', md: '3.3rem', lg: '5rem' }}
          marginTop={{ xs: '-1rem', sm: '1rem', md: '4rem', lg: '6.5rem' }}
          marginBottom={{ xs: '2rem', sm: '1rem', md: '4rem', lg: '12rem' }}
        >
          Contact the Book Fair Team
        </Typography>
      </ContactUsStyle>

      {/* Contact Info Cards */}
      <Grid container direction="column" marginTop="3rem" zIndex={'10'}>
        <Grid item>
          <Box marginBottom="4rem">
            <Grid container spacing={{ xs: 4, md: 10 }} padding={{ md: '0.2rem' }}>
              {/* Visitor Help */}
              <Grid item xs={12} md={4}>
                <Cardall>
                  <CardContent>
                    <img
                      src={help}
                      alt="help"
                      style={{
                        width: '100px',
                        height: '100px',
                        marginBottom: '2rem',
                      }}
                    />
                    <Typography variant={'h4'} fontWeight={'600'}>
                      Visitor Help Desk
                    </Typography>
                    <Typography marginTop="3rem" color="textSecondary">
                      Have questions about entry tickets, directions, or event schedules?
                    </Typography>
                    <Typography marginTop="2rem" color="textSecondary">
                      Visit our information center or chat with our volunteers during fair hours.
                    </Typography>
                    <Typography variant={'h5'} fontWeight="600" marginTop="4rem">
                      Help Desk Hours:
                    </Typography>
                    <Typography marginTop="1rem" color={'textSecondary'}>
                      Daily: 9:00 AM – 8:00 PM
                    </Typography>
                  </CardContent>
                </Cardall>
              </Grid>

              {/* Call Section */}
              <Grid item xs={12} md={4}>
                <Cardall>
                  <CardContent>
                    <img
                      src={call}
                      alt="call"
                      style={{
                        width: '90px',
                        height: '90px',
                        marginTop: '1.5rem',
                        marginBottom: '1rem',
                      }}
                    />
                    <Typography variant={'h4'} fontWeight={'600'}>
                      Call Us
                    </Typography>
                    <Typography
                      marginTop="3rem"
                      variant={'h4'}
                      fontWeight={'600'}
                      color="primary"
                    >
                      +94 11 234 5678
                    </Typography>
                    <Typography marginTop="3rem" variant={'h5'} fontWeight={'600'}>
                      Fair Office Hours:
                    </Typography>
                    <Typography marginTop="1rem" color={'textSecondary'}>
                      Monday – Sunday: 8:30 AM – 6:00 PM
                    </Typography>
                    <Typography marginTop="2rem" color={'textSecondary'}>
                      For stall bookings, logistics, or general inquiries, please call our main office.
                    </Typography>
                  </CardContent>
                </Cardall>
              </Grid>

              {/* Email Section */}
              <Grid item xs={12} md={4}>
                <Cardall>
                  <CardContent>
                    <img
                      src={email}
                      alt="email"
                      style={{
                        width: '110px',
                        height: '110px',
                        marginBottom: '2rem',
                      }}
                    />
                    <Typography variant={'h4'} fontWeight={'600'}>
                      Email Us
                    </Typography>
                    <Typography marginTop="3rem" color="textSecondary">
                      For stall applications, partnership requests, or media inquiries, write to:
                    </Typography>
                    <Typography
                      marginTop="2rem"
                      variant={'h5'}
                      fontWeight={'600'}
                      color="primary"
                    >
                      info@colombobookfair.lk
                    </Typography>
                    <Typography marginTop="3rem" variant={'h5'} fontWeight={'600'}>
                      Response Hours:
                    </Typography>
                    <Typography marginTop="1rem" color={'textSecondary'}>
                      Monday – Friday: 9:00 AM – 5:00 PM
                    </Typography>
                    <Typography marginTop="1rem" color={'textSecondary'}>
                      (Replies within 24 hours)
                    </Typography>
                  </CardContent>
                </Cardall>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>

      {/* Event Location */}
      <Box
        sx={{
          textAlign: 'center',
          mt: 8,
          pb: 8,
        }}
      >
        <Typography variant="h4" fontWeight="600" gutterBottom>
          Event Venue
        </Typography>
        <Typography variant="h6" color="textSecondary">
          Bandaranaike Memorial International Conference Hall (BMICH), Colombo 07, Sri Lanka
        </Typography>
      </Box>
    </>
  );
};

// ======= STYLED COMPONENTS =======
const Cardall = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#FAFAFA',
  justifyContent: 'center',
  gap: '1.5rem',
  alignItems: 'center',
  textAlign: 'center',
  boxShadow: '0px 0px 16px rgba(0, 0, 0, 0.3)',
  width: '100%',
  height: '90%',
  padding: '3rem 1rem',
  borderRadius: '1rem',
});

const ContactUsStyle = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: 'white',
  paddingTop: '5rem',
  textAlign: 'center',
});

export default ContactUs;
