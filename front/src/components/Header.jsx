import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import Moralis from 'moralis';
import env from 'react-dotenv';
import { ethers } from 'ethers';
import { useAppContext } from '../context/stateContext';
import { ConnectWalletAction } from '../helpers/connectWallet';
import abi from '../utils/CourseFactory.json';
const contractAddress = '0x616df7bf1C791978C235cfDCDa39bCB0C42e51e9';

export default function Header() {
  const { address, setAddress, setCoursesCreated, setProvider } =
    useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    async function launchMoralis() {
      const serverUrl = env.MORALIS_URL;
      const appId = env.MORALIS_ID;
      const result = await Moralis.start({ serverUrl, appId });
      // const NODE_URL = "YOUR SPEEDY NODE URL HERE";
      // const provider = new ethers.providers.JsonRpcProvider(NODE_URL);

      // // provider is read-only get a signer for on-chain transactions
      // const signer = provider.getSigner();
      const provider = new ethers.providers.AlchemyProvider(
        'maticmum',
        env.ALCHEMY_KEY ? env.ALCHEMY_KEY : null
      );
      setProvider(provider);
    }
    launchMoralis();

    checkIfWalletIsConnected();
  }, []);

  useEffect(() => {
    async function checkCreatedCourses(signer) {
      const courseFactoryContract = new ethers.Contract(
        contractAddress,
        abi.abi,
        signer
      );
      const allContracts = await courseFactoryContract.getCourses(address);
      setCoursesCreated(allContracts);
    }
    const { ethereum } = window;

    if (address && ethereum) {
      const newProvider = new ethers.providers.Web3Provider(ethereum);
      const signer = newProvider.getSigner();
      setProvider(signer);
      checkCreatedCourses(signer);
    }
  }, [address]);

  const goHome = () => {
    navigate('/');
  };

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log('Make sure you have MetaMask!');
        return;
      } else {
        console.log('We have the ethereum object', ethereum);
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        if (accounts.length !== 0) {
          const account = accounts[0];
          console.log('Found an authorized account:', account);
          setAddress(account);
        } else {
          console.log('No authorized account found');
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connectWalletAction = async () => {
    const account = await ConnectWalletAction();
    setAddress(account);
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#183163' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box
            onClick={() => goHome()}
            sx={{ cursor: 'pointer', display: { xs: 'flex' } }}
          >
            <img
              src="https://ipfs.io/ipfs/bafkreieu6y3cnc65j653wmsddmjvhy6ufrceut7oug5c6pylhicqztfk4i"
              height="45px"
            ></img>
          </Box>
          <Typography
            variant="h2"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
            color="#FD9D80"
          >
            🏛️ Michi
          </Typography>
          <Box
            sx={{
              flexGrow: address ? 1 : 0.5,
              display: { xs: 'none', md: 'flex' },
            }}
          ></Box>
          <Box
            sx={{
              backgroundColor: 'white',
              borderRadius: 30,
              width: '35vw',
              height: '5vh',
            }}
          >
            <IconButton
              sx={{
                p: '10px',
                ':hover': {
                  cursor: 'auto',
                },
              }}
              aria-label="search"
            >
              <SearchIcon />
            </IconButton>
            <InputBase
              sx={{ ml: 1, flex: 1, width: '25vw' }}
              placeholder="Search courses"
            />
          </Box>
          <Box
            sx={{ flexGrow: 0.5, display: { xs: 'none', md: 'flex' } }}
          ></Box>
          {address ? (
            <>
              {' '}
              <Box
                sx={{
                  display: {
                    xs: 'none',
                    md: 'flex',
                  },
                }}
              >
                <Box
                  sx={{ cursor: 'pointer' }}
                  onClick={() => navigate('/mynft')}
                >
                  <Typography sx={{ fontWeight: 'bold', color: '#FEF7F0' }}>
                    My Lessons
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  display: {
                    xs: 'none',
                    md: 'flex',
                  },
                  color: '#F87060',
                  cursor: 'pointer',
                  ml: 5,
                }}
                onClick={() => navigate('/courses-created')}
              >
                <Box>
                  <Typography sx={{ fontWeight: 'bold', color: '#FEF7F0' }}>
                    Teach online
                  </Typography>
                </Box>
                {/* <IconButton size="large" color="inherit">
              <MenuIcon />
            </IconButton> */}
              </Box>{' '}
            </>
          ) : null}
          <Box>
            {address ? (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  alignItems: 'center',
                  backgroundColor: '#F87060',
                  ml: 5,
                  width: 160,
                  height: '5vh',
                  borderRadius: 30,
                }}
              >
                {address.slice(0, 5) + '...' + address.slice(-5)}{' '}
              </Box>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  alignItems: 'center',
                  backgroundColor: '#F87060',
                  width: 160,
                  height: '5vh',
                  borderRadius: 30,
                  cursor: 'pointer',
                  ':hover': {
                    bgcolor: '#FEF7F0', // theme.palette.primary.main
                    color: '#FD9D80',
                  },
                }}
                onClick={() => connectWalletAction()}
              >
                Log in
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
