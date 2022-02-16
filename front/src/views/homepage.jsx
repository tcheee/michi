import '../App.css';
import React, { useEffect, useState, useContext } from 'react';
import { useAppContext } from '../context/stateContext';
import { Container, Typography, Box, Paper, ThemeProvider } from '@mui/material';
import { createTheme } from '@material-ui/core/styles';
import { ethers } from 'ethers';
import course from '../utils/course.json';
import factory from '../utils/CourseFactory.json';
import DisplayNFT from '../components/displayNFT';
import Gridloader from '../components/Gridloader';
import { getMetadataNFT } from '../helpers/getMetadataNFT';

export default function Homepage() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [factoryContract, setFactoryContract] = useState(null);
  const { address, setAddress, provider } = useAppContext();
  const styles = {
    paperContainer: {
      height: '70vh',
      backgroundRepeat: "no-repeat",
      backgroundImage: 'url("https://ipfs.io/ipfs/bafybeigwmkad7ap37rf46kh7qgnb2w7xjzjyex2x4uyy7a3hpcxd3ld7mq")',
      height: '482px',
      backgroundSize: 'cover',
      borderRadius: '15px'
    }
  };
  const theme = createTheme({
    typography: {
      fontFamily: [
        'Righteous',
        'cursive',
      ].join(','),
    },
  });

  useEffect(() => {
    if (provider) {
      const getContractPrice = (_address) => {
        return new Promise(async (resolve, reject) => {
          let courseContract = new ethers.Contract(
            _address,
            course.abi,
            provider
          );
          const coursePrice = await courseContract.getAmount();
          resolve(ethers.utils.formatEther(coursePrice));
        });
      };

      async function getCoursesFromChain(contract) {
        try {
          if (contract) {
            const addressArray = await contract.getContracts();
            console.log(addressArray);
            const result = await Promise.all(
              addressArray.map((nftAddress) => getMetadataNFT(nftAddress))
            );
            const courses = result.filter((nft) => nft != null);
            const coursesWithPrices = [];
            for (let course of courses) {
              const price = await getContractPrice(course.address);
              coursesWithPrices.push({ ...course, price });
            }
            console.log(coursesWithPrices);
            setLessons(coursesWithPrices);
            setLoading(false);
          }
        } catch (error) {
          console.error(error);
        }
      }

      const contract = new ethers.Contract(
        '0x616df7bf1C791978C235cfDCDa39bCB0C42e51e9',
        factory.abi,
        provider
      );
      setFactoryContract(contract);
      getCoursesFromChain(contract);
    } else {
      console.log('No provider found.');
    }
  }, [provider]);

  return (
    <Container className="main-container" maxWidth="xl" >
      <Paper
        style={styles.paperContainer}
        justify="space-evenly"
        sx={{ mt: '5vh' }}
      >
        <ThemeProvider theme={theme}>
          <Typography sx={{ textAlign: 'right', pt: '10%', pr: '5vh', color: '#FF9479', fontSize: '60px' }}>
            Decentralized</Typography>
          <Typography sx={{ textAlign: 'right', pr: '5vh', color: '#FF9479', fontSize: '60px' }}>
            Learning</Typography>
        </ThemeProvider>
      </Paper>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <ThemeProvider theme={theme}>
          <Typography sx={{ mt: '30px', fontSize: 25 }}>
            All the courses available
          </Typography>
        </ThemeProvider>
      </Box>
      {loading ? (
        <Gridloader />
      ) : (
        <DisplayNFT lessons={lessons} displayPrice={true} />
      )}
    </Container>
  );
}
