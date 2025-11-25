import { Box, Button, CardContent, Grid, styled, Typography } from '@mui/material';
import help from '../assets/contactushelp.svg';
import call from '../assets/contactuscall.svg';
import email from '../assets/contactusemail.svg';
import coverimage from '../assets/coverimage.jpg';
import { useNavigate } from "react-router-dom";

const ContactUs = () => {

  const navigate = useNavigate();
  return (
    <>
      <Grid container direction="column" marginTop="2rem">
        <HeroContainer
          height={{ xs: "18rem", sm: "20rem", md: "28rem", lg: "34rem" }}
        >
          <Typography
            variant="h2"
            color="white"
            fontSize={{
              xs: "1.8rem",
              sm: "2.5rem",
              md: "3.0rem",
            }}
            maxWidth={{ xs: "90%", md: "60%" }}
            textAlign="center"
            fontWeight="700"
          >
            Contact the Book Fair Team
          </Typography>
        </HeroContainer>

        {/* Contact Info Cards */}
        <Grid container direction="column" marginTop="3rem" zIndex={"10"}>
          <Grid item>
            <Box marginBottom="4rem">
              <Grid
                container
                spacing={{ xs: 4, md: 10 }}
                padding={{ md: "0.2rem" }}
              >
                {/* Visitor Help */}
                <Grid item xs={12} md={4}>
                  <Cardall>
                    <CardContent>
                      <img
                        src={help}
                        alt="help"
                        style={{
                          width: "100px",
                          height: "100px",
                          marginBottom: "2rem",
                        }}
                      />
                      <Typography variant={"h4"} fontWeight={"600"}>
                        Visitor Help Desk
                      </Typography>
                      <Typography marginTop="3rem" color="textSecondary">
                        Have questions about entry tickets, directions, or event
                        schedules?
                      </Typography>
                      <Typography marginTop="2rem" color="textSecondary">
                        Visit our information center or chat with our volunteers
                        during fair hours.
                      </Typography>
                      <Typography
                        variant={"h5"}
                        fontWeight="600"
                        marginTop="4rem"
                      >
                        Help Desk Hours:
                      </Typography>
                      <Typography marginTop="1rem" color={"textSecondary"}>
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
                          width: "90px",
                          height: "90px",
                          marginTop: "1.5rem",
                          marginBottom: "1rem",
                        }}
                      />
                      <Typography variant={"h4"} fontWeight={"600"}>
                        Call Us
                      </Typography>
                      <Typography
                        marginTop="3rem"
                        variant={"h4"}
                        fontWeight={"600"}
                        color="primary"
                      >
                        +94 11 234 5678
                      </Typography>
                      <Typography
                        marginTop="3rem"
                        variant={"h5"}
                        fontWeight={"600"}
                      >
                        Fair Office Hours:
                      </Typography>
                      <Typography marginTop="1rem" color={"textSecondary"}>
                        Monday – Sunday: 8:30 AM – 6:00 PM
                      </Typography>
                      <Typography marginTop="2rem" color={"textSecondary"}>
                        For stall bookings, logistics, or general inquiries,
                        please call our main office.
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
                          width: "110px",
                          height: "110px",
                          marginBottom: "2rem",
                        }}
                      />
                      <Typography variant={"h4"} fontWeight={"600"}>
                        Email Us
                      </Typography>
                      <Typography marginTop="3rem" color="textSecondary">
                        For stall applications, partnership requests, or media
                        inquiries, write to:
                      </Typography>
                      <Typography
                        marginTop="2rem"
                        variant={"h5"}
                        fontWeight={"600"}
                        color="primary"
                      >
                        info@colombobookfair.lk
                      </Typography>
                      <Typography
                        marginTop="3rem"
                        variant={"h5"}
                        fontWeight={"600"}
                      >
                        Response Hours:
                      </Typography>
                      <Typography marginTop="1rem" color={"textSecondary"}>
                        Monday – Friday: 9:00 AM – 5:00 PM
                      </Typography>
                      <Typography marginTop="1rem" color={"textSecondary"}>
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
            textAlign: "center",
            mt: 8,
            pb: 8,
          }}
        >
          <Typography variant="h4" fontWeight="600" gutterBottom>
            Event Venue
          </Typography>
          <Typography variant="h6" color="textSecondary">
            Bandaranaike Memorial International Conference Hall (BMICH), Colombo
            07, Sri Lanka
          </Typography>
        </Box>
      </Grid>
    </>
  );
};

// ======= STYLED COMPONENTS =======

const HeroContainer = styled(Box)({
  background: `linear-gradient(0deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5)), url(${coverimage})`,
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  backgroundPosition: "center",
  padding: "0 1rem",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: 42,
  marginBottom: "4rem",
  boxShadow: "0px 0px 16px rgba(0, 0, 0, 0.2)",
});



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
