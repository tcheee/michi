import { Box } from '@mui/material';
import { Rings } from 'react-loader-spinner';

export default function ButtonLoader() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#F87060',
        color: 'white',
        width: 160,
        height: 45,
        borderRadius: 30,
        mb: 4,
        mt: 4,
        cursor: 'pointer',
        ':hover': {
          bgcolor: '#183163', // theme.palette.primary.main
          color: '#FFFFFF',
        },
      }}
    >
      <Rings ariaLabel="loading-indicator" color="white" />
    </Box>
  );
}
