import { Container, Typography, ThemeProvider, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import aboutUsImage from "../assets/about-us.png";
import ourMissionImage from "../assets/our-mission.jpg";
import ourStoryImage from "../assets/our-story.jpg";
import StyledImage from "./StyledImage";

const AboutUs = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <ThemeProvider theme={theme}>
      <Box bgcolor="#ffffff" pb="4rem" mt="2rem">
        <Container maxWidth="lg">
          <Box
            py="4rem"
            display="flex"
            flexDirection={{ xs: "column-reverse", md: "row" }}
            alignItems="center"
          >
            <Box flex="1">
              <Typography variant="h3" component="h2" gutterBottom>
                About Us
              </Typography>
              <Typography variant="body1">
                The Colombo International Bookfair, organized by the Sri Lanka
                Book Publishers’ Association, is the largest and most
                prestigious literary event in Sri Lanka. Held annually, it
                serves as a central hub for book publishers, authors, vendors,
                and readers to come together and celebrate the power of
                literature and knowledge. The fair showcases a vast range of
                books spanning every genre imaginable, from fiction and
                non-fiction to educational and rare publications. It provides an
                unmatched opportunity for publishers and vendors to connect
                directly with readers, promote their latest works, and engage in
                meaningful conversations about literature, culture, and
                education. Over the years, the fair has become a cultural
                landmark, attracting thousands of visitors and contributing
                significantly to the literary landscape of the country.
              </Typography>
            </Box>
            <Box flex="1" textAlign="center">
              <StyledImage
                src={aboutUsImage}
                alt="About Us"
                isSmallScreen={isSmallScreen}
              />
            </Box>
          </Box>

          <Box
            py="4rem"
            display="flex"
            flexDirection={{ xs: "column-reverse", md: "row-reverse" }}
            alignItems="center"
          >
            <Box flex="1">
              <Typography variant="h3" component="h2" gutterBottom>
                Our Story
              </Typography>
              <Typography variant="body1">
                The Colombo International Bookfair has a rich and inspiring
                history. What started as a modest gathering of a few local
                publishers has, over the years, grown into a nationally renowned
                event that attracts participants from all over Sri Lanka and
                abroad. The fair has always aimed to create a platform where
                authors, publishers, and readers can connect, exchange ideas,
                and celebrate literature. With its continuous growth, the fair
                has embraced innovation and technology to meet the evolving
                needs of exhibitors and visitors. By introducing a dedicated
                stall reservation system, we ensure that the process of booking
                and managing exhibition spaces is smooth, efficient, and
                convenient. The Colombo International Bookfair continues to
                inspire generations of readers and creators alike, reinforcing
                the importance of books, knowledge, and cultural heritage in Sri
                Lanka.
              </Typography>
            </Box>
            <Box flex="1" textAlign="center" mb={{ xs: "2rem", md: 0 }}>
              <StyledImage src={ourStoryImage} alt="Our Story" />
            </Box>
          </Box>

          <Box
            py="4rem"
            display="flex"
            flexDirection={{ xs: "column-reverse", md: "row" }}
            alignItems="center"
          >
            <Box flex="1">
              <Typography variant="h3" component="h2" gutterBottom>
                Our Mission
              </Typography>
              <Typography variant="body1">
                Our mission is to foster a love for reading and learning while
                supporting the growth and visibility of Sri Lankan publishers
                and authors. We aim to create a well-organized, accessible, and
                enjoyable experience for exhibitors and visitors alike, ensuring
                that every participant can make the most of this literary
                celebration. By implementing modern solutions such as a stall
                reservation system, we strive to streamline the organization of
                the event, making it easier for publishers and vendors to secure
                their space, plan their exhibitions, and reach a wider audience.
                Ultimately, we are committed to promoting literacy, cultural
                exchange, and the joy of discovering new stories for everyone
                who attends the bookfair.
              </Typography>
            </Box>
            <Box flex="1" textAlign="center">
              <StyledImage src={ourMissionImage} alt="Our Mission" />
            </Box>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default AboutUs;
