import { Typography, Box } from '@mui/material';
import { Grid as Gridtimer } from 'react-loader-spinner';

export default function Gridloader() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        mt: '20vh',
      }}
    >
      <Gridtimer color="#FD9D80" height={200} width={200} radius={10} />
      <Typography sx={{ mt: '5vh', fontWeight: 'bold' }}>
        {/* <span style={{ fontStyle: 'italic' }}> */}
        Getting the data from the "blockchain"! 🤯 🤯 🤯
        {/* </span> */}
      </Typography>
    </Box>
  );
}
