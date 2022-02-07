import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import abi from '../utils/CourseFactory.json';
import course from '../utils/course.json';
import { Container, Typography, Box, Button } from '@mui/material';
import DisplayNFT from '../components/displayNFT';
import { useAppContext } from '../context/stateContext';
import { getMetadataNFT } from '../helpers/getMetadataNFT';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function MyDashboard() {
  const [allCoursesCreated, setAllCoursesCreated] = useState([]);
  const [noContract, setNoContract] = useState(false);
  const [totalAmount, setTotalAmount] = useState(null);
  const [totalMinted, setTotalMinted] = useState(null);
  const [signer, setSigner] = useState(null);
  const contractAddress = '0x616df7bf1C791978C235cfDCDa39bCB0C42e51e9';
  const { address, setAddress, provider } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    const { ethereum } = window;

    if (ethereum && address && provider) {
      const courseFactoryContract = new ethers.Contract(
        contractAddress,
        abi.abi,
        provider
      );

      const amountInContract = (_address) => {
        return new Promise(async (resolve, reject) => {
          let courseContract = new ethers.Contract(
            _address,
            course.abi,
            provider
          );
          const moneyInContract = await courseContract.getMoney();
          resolve(ethers.utils.formatEther(moneyInContract));
        });
      };

      const numberCoursesSold = (_address) => {
        console.log(_address);
        return new Promise(async (resolve, reject) => {
          let courseContract = new ethers.Contract(
            _address,
            course.abi,
            provider
          );
          const numberOfCourses = await courseContract.getNumberOfTokenMinted();
          resolve(numberOfCourses.toNumber());
        });
      };

      const main = async () => {
        try {
          const allContracts = await courseFactoryContract.getCourses(address);
          const result = await Promise.all(
            allContracts.map((address) => getMetadataNFT(address))
          );
          const courses = result.filter((nft) => nft != null);
          const coursesWithNumber = [];
          let totalAmount = 0;
          let totalSold = 0;
          for (let course of courses) {
            const amount = await amountInContract(course.address);
            const numberSold = await numberCoursesSold(course.address);
            totalAmount += parseFloat(amount);
            totalSold += parseFloat(numberSold);
            coursesWithNumber.push({ ...course, amount, numberSold });
          }
          setTotalAmount(totalAmount);
          setTotalMinted(totalSold);
          setAllCoursesCreated(coursesWithNumber);
        } catch (err) {
          console.log(err);
          if (err.data.message.includes("You don't have any contract")) {
            setNoContract(true);
          }
        }
      };

      main();
    } else {
      console.log('Ethereum object not found');
    }
  }, [address]);

  const withdrawMoneyFromContract = (_address, amount) => {
    return new Promise(async (resolve, reject) => {
      try {
        let courseContract = new ethers.Contract(
          _address,
          course.abi,
          provider
        );
        const withdrawTx = await courseContract.withDrawMoney(
          ethers.utils.parseEther(amount.toString())
        );
        await withdrawTx.wait();
        console.log(withdrawTx);
        resolve(true);
      } catch (err) {
        reject(err);
      }
    });
  };

  const withdrawRevenues = async () => {
    for (let course of allCoursesCreated) {
      if (parseFloat(course.amount) > 0) {
        try {
          const withdrawAmount = parseFloat(course.amount);
          await withdrawMoneyFromContract(course.address, withdrawAmount);
          toast.success(
            `Money on its way to your wallet for ${course.name}. Make sure to validate the transaction in your wallet!`,
            {
              position: 'top-right',
              autoClose: 5000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
            }
          );
        } catch (err) {
          console.log(err);
          toast.error(`Error while withdrawing money for: ${course.name}`, {
            position: 'top-right',
            autoClose: 8000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
          });
        }
      }
    }
  };

  return (
    <Container className="main-container" maxWidth="false">
      <ToastContainer />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <Box
            sx={{
              flexGrow: 1,
            }}
          >
            <Typography
              sx={{
                mt: '30px',
                fontSize: 25,
                fontWeight: 'bold',
              }}
            >
              My created courses!
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            backgroundColor: '#183163',
            width: '96vw',
            height: '12vh',
            minHeight: '90px',
            boxShadow: 10,
            borderRadius: 3,
            mt: 2,
            color: '#FD9D80',
            fontWeight: 'bold',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              ml: 5,
              mr: 10,
              mt: 1,
              alignItems: 'center',
            }}
          >
            <Typography>Total Revenues Available</Typography>
            <Typography mt={2}>
              {totalAmount === null ? null : 'M ' + totalAmount}
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mt: 1,
            }}
          >
            <Typography>Total Courses Sold</Typography>
            <Typography mt={2}> {totalMinted}</Typography>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}></Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: '#F87060',
                color: '#183163',
                fontWeight: 'bold',
                width: 220,
                height: 45,
                mr: 2,
                borderRadius: 30,
                cursor: 'pointer',
                ':hover': {
                  bgcolor: '#FEF7F0', // theme.palette.primary.main
                  color: '#FD9D80',
                },
              }}
              onClick={() => navigate('/form')}
            >
              ➕ Create a new course
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                alignItems: 'center',
                color: 'white',
                backgroundColor: '#F87060',
                width: 220,
                height: 45,
                mr: 2,
                borderRadius: 30,
                cursor: 'pointer',
                ':hover': {
                  bgcolor: '#FEF7F0', // theme.palette.primary.main
                  color: '#FD9D80',
                },
              }}
              onClick={() => withdrawRevenues()}
            >
              💰 Withdraw my revenues
            </Box>
          </Box>
        </Box>
      </Box>
      {noContract ? (
        <Box></Box>
      ) : (
        <DisplayNFT lessons={allCoursesCreated} creatorInformation={true} />
      )}
    </Container>
  );
}
