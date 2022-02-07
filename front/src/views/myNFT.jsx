import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Moralis from 'moralis';
import { Container, Box, Typography } from '@mui/material';
import DisplayNFT from '../components/displayNFT';
import { useAppContext } from '../context/stateContext';
import { getMetadataNFT } from '../helpers/getMetadataNFT';

export default function MyNFT() {
  const { address } = useAppContext();
  const [courseContract, setCourseContract] = useState(null);
  const [myNFT, setMyNFT] = useState([]);

  useEffect(() => {
    async function getAllNFT() {
      // get polygon NFTs for address
      const options = {
        chain: 'mumbai',
        address: address,
      };
      const polygonNFTs = await Moralis.Web3API.account.getNFTs(options);
      const boughtLessons = polygonNFTs.result.filter(
        (nft) => nft.token_id === '1'
      );
      const result = await Promise.all(
        boughtLessons.map((nft) => getMetadataNFT(nft.token_address))
      );
      setMyNFT(result.filter((nft) => nft != null));
    }
    getAllNFT();
  }, [address]);

  return (
    <Container className="main-container" maxWidth="false">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography sx={{ mt: '30px', fontSize: 25, fontWeight: 'bold' }}>
          All the lessons I bought!
        </Typography>
      </Box>
      <DisplayNFT lessons={myNFT} />
    </Container>
  );
}
