import '../App.css';
import axios from 'axios';
import React, { Component, useEffect, useState } from 'react';
import env from 'react-dotenv';
import { v4 as uuidv4 } from 'uuid';
import { ethers, utils } from 'ethers';
import abi from '../utils/CourseFactory.json';
import { useAppContext } from '../context/stateContext';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Rings } from 'react-loader-spinner';
import { supabase } from '../helpers/db.js';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ButtonLoader from '../components/buttonLoader';
import MUIRichTextEditor from 'mui-rte';
import { EditorState, convertToRaw } from 'draft-js';
import { pinFileToIPFS, pinJSONToIPFS } from '../helpers/pinFileOnIpfs.js';
import {
  Container,
  Typography,
  Box,
  TextField,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  Grid,
} from '@mui/material';
var CryptoJS = require('crypto-js');
const FormData = require('form-data');
const notifyMinting = () =>
  toast.info('Transaction sent!', {
    position: 'top-left',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
const notifyMinted = () =>
  toast.success('Course minted!', {
    position: 'top-left',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });

export default function Form() {
  const { address } = useAppContext();
  const [selectedVideoFile, setSelectedVideoFile] = useState(null);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [price, setPrice] = useState('');
  const [isMinted, setIsMinted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [contractAddressCreated, setContractAddressCreated] = useState('');
  const [encryptionKey, setEncryptionKey] = useState(uuidv4());
  const contractAddress = '0x616df7bf1C791978C235cfDCDa39bCB0C42e51e9';
  const contractABI = abi.abi;
  const navigate = useNavigate();
  const goCourse = (_courseAddress) => {
    navigate('/courses-created/');
  };

  const myTheme = createTheme({});

  const MintButton = () => {
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
        onClick={handleSubmit}
      >
        Mint your course
      </Box>
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFileUpload();
  };

  const SeeMyCourse = () => {
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
        onClick={() => goCourse(contractAddressCreated)}
      >
        See my Course
      </Box>
    );
  };

  const uploadHashOnDb = async (_address) => {
    try {
      const { data, error } = await supabase.from('lesson_hash').insert([
        {
          course_address: _address.toLowerCase(),
          hash: encryptionKey,
        },
      ]);
      if (error) {
        console.log(error);
        return 'not ok';
      } else {
        console.log(data);
        return 'ok';
      }
    } catch (err) {
      console.log(err);
      return 'not ok';
    }
  };

  async function mintLesson(price, url) {
    if (window.ethereum) {
      notifyMinting();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const courseFactoryContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      let course_txn = await courseFactoryContract.createLesson(price, url);
      const receipt = await course_txn.wait();

      const event = receipt.events;

      console.log('Address of the contract created ==> ', event[0].address);
      setContractAddressCreated(event[0].address);
      setIsMinted(true);
      console.log('txn:', course_txn);

      return event[0].address;
      notifyMinted();
    } else {
      console.error('no contract connected');
    }
  }

  const onFileUpload = () => {
    async function main() {
      setIsLoading(true);
      try {
        const ipfsVideoUrl = await pinFileToIPFS(selectedVideoFile, title);
        const videoEncrypt = CryptoJS.AES.encrypt(
          JSON.stringify(ipfsVideoUrl),
          encryptionKey
        ).toString();
        console.log('content', content);
        const contentEncrypt = CryptoJS.AES.encrypt(
          JSON.stringify(content),
          encryptionKey
        ).toString();
        console.log('encrypted', contentEncrypt);
        const ipfsImageUrl = await pinFileToIPFS(selectedImageFile, title);
        const dataJson = {
          name: 'MICHI',
          description:
            title +
            '\n\n' +
            description +
            '\n\nThis course was created on michilearn.xyz',
          image: ipfsImageUrl,
          slug: 'michi_learn',
          ipfs_video_url: videoEncrypt,
          content: contentEncrypt,
          metadata: {
            name: title,
            description: description,
            background_image: ipfsImageUrl,
            price: price,
            author: address,
          },
        };
        const uri = await pinJSONToIPFS(dataJson);
        const priceInEth = utils.parseEther(price.toString());
        const up = await mintLesson(priceInEth, uri);
        uploadHashOnDb(up);
      } catch (e) {
        setIsLoading(false);
      }
      setIsLoading(false);
    }

    main();
  };

  return (
    <Container>
      <ToastContainer />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography
          variant="h4"
          color="#000000"
          sx={{ mt: '20px', mb: '20px' }}
        >
          Create a course
        </Typography>
      </Box>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: '100vh' }}
      >
        <TextField
          id="outlined-basic"
          label="Name of the course"
          variant="outlined"
          type="text"
          margin="dense"
          sx={{ width: '60%' }}
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
        <TextField
          id="outlined-basic"
          label="Description of the course"
          variant="outlined"
          type="text"
          margin="dense"
          sx={{ width: '60%' }}
          multiline
          rows={4}
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
        />
        <TextField
          id="outlined-start-adornment"
          label="Price of the course"
          margin="dense"
          sx={{ width: '60%' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">MATIC</InputAdornment>
            ),
          }}
          value={price}
          onChange={(e) => {
            setPrice(e.target.value);
          }}
        />
        <br />
        <Box sx={{ width: '60%' }}>
          <label>Upload your video content</label>
          <input
            type="file"
            onChange={(e) => {
              setSelectedVideoFile(e.target.files[0]);
            }}
          />
          <br />
          <br />
          <label>Upload a background image</label>
          <input
            type="file"
            onChange={(e) => {
              setSelectedImageFile(e.target.files[0]);
            }}
          />
        </Box>
        <Box sx={{ mb: '60px', width: '60%' }}>
          <ThemeProvider theme={myTheme}>
            <MUIRichTextEditor
              label="Start typing your course ..."
              onChange={(e) => {
                setContent(JSON.stringify(convertToRaw(e.getCurrentContent())));
              }}
              controls={[
                'title',
                'bold',
                'italic',
                'underline',
                'strikethrough',
                'highlight',
                'undo',
                'redo',
                'link',
                'media',
                'numberList',
                'bulletList',
                'quote',
                'code',
                'clear',
              ]}
            />
          </ThemeProvider>
        </Box>
        {isMinted ? (
          <SeeMyCourse />
        ) : isLoading ? (
          <ButtonLoader />
        ) : (
          <MintButton />
        )}
      </Grid>
    </Container>
  );
}
