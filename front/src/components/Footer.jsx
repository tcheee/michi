import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import { Link } from '@mui/material';

export default function Footer() {
  return <div></div>;
  // return (
  //   <AppBar position="static" sx={{ backgroundColor: '#000000' }}>
  //     <Container maxWidth="xl">
  //       <Box sx={{ display: 'flex', flexDirection: 'row-reverse' }}>
  //         <Link
  //           href="https://twitter.com/thomas_cherret"
  //           underline="none"
  //           sx={{ cursor: 'pointer' }}
  //         >
  //           <Typography
  //             component="div"
  //             color="#1D1F23"
  //             variant="caption"
  //             sx={{
  //               mr: 2,
  //               display: { xs: 'none', md: 'flex' },
  //               fontStyle: 'italic',
  //             }}
  //           >
  //             Made by @tche
  //           </Typography>
  //         </Link>
  //       </Box>
  //       <Box sx={{ display: 'flex', flexDirection: 'row-reverse' }}>
  //         <Link
  //           href="https://twitter.com/thomas_cherret"
  //           underline="none"
  //           target="_blank"
  //         >
  //           <Typography
  //             noWrap
  //             component="div"
  //             color="#1D1F23"
  //             variant="caption"
  //             sx={{
  //               flexGrow: 1,
  //               display: { xs: 'flex', md: 'none' },
  //               fontStyle: 'italic',
  //             }}
  //           >
  //             Made by @tche
  //           </Typography>
  //         </Link>
  //       </Box>
  //       <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}></Box>
  //     </Container>
  //   </AppBar>
  // );
}
