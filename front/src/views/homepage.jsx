import '../App.css';
import React, { useEffect, useState, useContext } from 'react';
import { useAppContext } from '../context/stateContext';
import { Container, Typography, Box } from '@mui/material';
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
    <Container className="main-container" maxWidth="false">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography sx={{ mt: '30px', fontSize: 25, fontWeight: 'bold' }}>
          Latest courses uploaded on Michi!
        </Typography>
      </Box>
      {loading ? (
        <Gridloader />
      ) : (
        <DisplayNFT lessons={lessons} displayPrice={true} />
      )}
    </Container>
  );
}
