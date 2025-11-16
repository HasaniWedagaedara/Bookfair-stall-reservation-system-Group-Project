import { styled } from '@mui/material';

const StyledImage = styled('img')<{ isSmallScreen?: boolean }>(
  ({ isSmallScreen }) => ({
    width: isSmallScreen ? '24rem' : '32rem',
    borderRadius: '8px',
    marginBottom: '2rem',
  })
);
export default StyledImage;