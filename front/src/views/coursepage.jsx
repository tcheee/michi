import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Typography, Box, Divider } from '@mui/material';
import { useAppContext } from '../context/stateContext';
import { ethers } from 'ethers';
import course from '../utils/course.json';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getDecodedVideoURL } from '../helpers/getDecodedVideoURL';
import { getDecodedContent } from '../helpers/getDecodedContent';
import { getCourseContentNFT } from '../helpers/getCourseContentNFT';
import { ConnectWalletAction } from '../helpers/connectWallet';
import { getNFTBought } from '../helpers/getNFTBought';
import { mintReward } from '../helpers/mintReward';
import DisplayContent from '../components/displayContent.jsx';
import ButtonLoader from '../components/buttonLoader';

export default function Coursepage() {
  const {
    address,
    setAddress,
    activeCourse,
    setActiveCourse,
    coursesCreated,
    provider,
  } = useAppContext();
  const location = useLocation();
  const [lesson, setLesson] = useState(location.state);
  const [buying, setBuying] = useState(false);
  const [courseContract, setCourseContract] = useState(null);
  const [courseId, setCourseId] = useState(null);
  const [image, setImage] = useState(null);
  const [lessonOwner, setLessonOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [videoHash, setVideoHash] = useState('');
  const [video, setVideo] = useState('');
  const [price, setPrice] = useState('');
  const [creator, setCreator] = useState(false);
  const [content, setContent] = useState('');
  const [contentDecrypted, setContentDecrypted] = useState('');
  const [certificateLoading, setCertificateLoading] = useState(false);
  const [certificationMinted, setCertificationMinted] = useState(false);
  const [urlOS, setUrlOS] = useState('');
  const navigate = useNavigate();

  const getNFT = async (courseAddress) => {
    const result = await getNFTBought(address, courseAddress);
    if (result.success && result.owner) {
      setVideoHash(result.video_link);
      setContent(result.content);
    } else {
      setLessonOwner(false);
      setLoading(false);
    }
  };

  const getMetadata = async (courseAddress) => {
    const result = await getCourseContentNFT(courseAddress);
    if (result.ipfs_video_url) {
      setVideoHash(result.ipfs_video_url);
      setContent(result.content);
    } else {
      setLessonOwner(false);
      setLoading(false);
    }
  };

  const verifyOwnerOrBuyer = (courseAddress) => {
    if (coursesCreated.includes(courseAddress)) {
      setCreator(true);
      getMetadata(courseAddress);
    } else if (address) {
      getNFT(courseAddress);
    } else {
      console.log('heree');
      setLoading(false);
    }
  };

  const setUpCourseContract = (courseAddress) => {
    if (provider) {
      const courseContract = new ethers.Contract(
        courseAddress,
        course.abi,
        provider
      );
      setCourseContract(courseContract);
    } else {
      console.log('Ethereum object not found');
    }
  };

  useEffect(() => {
    if (!location.state) {
      navigate('/');
    }
    const courseAddress = location.state.address;
    setImage(location.state.background_image);
    setCourseId(courseAddress);
    setPrice(location.state.price);
    verifyOwnerOrBuyer(courseAddress);
    setUpCourseContract(courseAddress);
  }, []);

  useEffect(() => {
    console.log(courseId);
    if (courseId) {
      verifyOwnerOrBuyer(courseId);
      setUpCourseContract(courseId);
    }
  }, [address]);

  useEffect(() => {
    async function accessContent() {
      try {
        const result = await getDecodedContent(content, courseId);
        if (result.success) {
          setContentDecrypted(result.data);
          setLessonOwner(true);
          setLoading(false);
        } else {
          console.log('abcd error');
          toast.error(`Error while decoding the video ...`, {
            position: 'top-right',
            autoClose: 8000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
          });
        }
      } catch (err) {
        console.log('hard error');
        console.log(err);
        toast.error(`Error while decoding the video ...`, {
          position: 'top-right',
          autoClose: 8000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
        });
      }
    }

    if (content) {
      accessContent();
    }
  }, [content]);

  useEffect(() => {
    async function accessCourse() {
      try {
        const result = await getDecodedVideoURL(videoHash, courseId);
        if (result.success) {
          setVideo(result.data);
          setLessonOwner(true);
          setLoading(false);
        } else {
          toast.error(`Error while decoding the video ...`, {
            position: 'top-right',
            autoClose: 8000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
          });
        }
      } catch (err) {
        console.log(err);
        toast.error(`Error while decoding the video ...`, {
          position: 'top-right',
          autoClose: 8000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
        });
      }
    }

    if (videoHash) {
      accessCourse();
    }
  }, [videoHash]);

  useEffect(() => {
    if (provider && courseId) {
      let newCourseContract = new ethers.Contract(
        courseId,
        course.abi,
        provider
      );
      setCourseContract(newCourseContract);
    }
  }, [provider]);

  const mintCourse = async () => {
    try {
      setBuying(true);
      if (courseContract) {
        const mintTxn = await courseContract.takeClass({
          value: ethers.utils.parseEther(price),
        });
        const result = await mintTxn.wait();
        setBuying(false);
        navigate('/mynft');
      }
    } catch (error) {
      console.error('Error while minting:', error);
      toast.error(`Error while buying the course. Please try again later!`, {
        position: 'top-right',
        autoClose: 8000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
      });
    }
  };

  const connectWalletAction = async () => {
    const account = await ConnectWalletAction();
    setAddress(account);
  };

  const mintCertificate = async () => {
    let newDate = new Date();
    setCertificateLoading(true);
    try {
      const result = await mintReward(address, provider, {
        name: `Michi - ${lesson.name}`,
        description: lesson.description,
        image: lesson.background_image,
        attributes: {
          date: newDate.toISOString().split('T')[0].toString(),
          address_course: courseId,
          reward: 'completed',
        },
      });
      if (result && result.events) {
        const id = result.events[0].args.tokenId.toNumber();
        setUrlOS(
          `https://testnets.opensea.io/assets/mumbai/0xD3d73eF76847Ea0EDEdcf839A962b17aAeBfcFed/${id}`
        );
        setCertificateLoading(false);
        setCertificationMinted(true);
        toast.success(
          <p>
            <a href={urlOS}>Here is the link to your certificate! </a>
          </p>,
          {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
          }
        );
        toast.info(
          <p>It can take 5 to 10 minutes to see your NFT on OpenSea!</p>,
          {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
          }
        );
      }
    } catch (err) {
      console.log('ddddd error');
      console.log(err);
      toast.error(`Error while minting your certificate ...`, {
        position: 'top-right',
        autoClose: 8000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
      });
    }
  };

  const MintCertificateButton = () => {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: '#F87060',
          fontWeight: 'bold',
          mt: 2,
          width: 250,
          height: 45,
          borderRadius: 30,
          cursor: 'pointer',
          ':hover': {
            bgcolor: '#FEF7F0',
            color: '#FD9D80',
          },
        }}
        onClick={() => mintCertificate()}
      >
        Mint my certificate
      </Box>
    );
  };

  const SeeMyCertificateButton = () => {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: '#F87060',
          fontWeight: 'bold',
          mt: 2,
          width: 250,
          height: 45,
          borderRadius: 30,
          cursor: 'pointer',
          ':hover': {
            bgcolor: '#FEF7F0',
            color: '#FD9D80',
          },
        }}
        onClick={(e) => {
          e.preventDefault();
          window.open(urlOS, '_blank');
        }}
      >
        See my certificate!
      </Box>
    );
  };

  return (
    <Container>
      <ToastContainer />
      <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 3 }}>
        {lesson.name}
      </Typography>
      <Typography sx={{ mt: 2, mb: 2 }}>{lesson.description} </Typography>
      {loading ? (
        <p> Loading ...</p>
      ) : lessonOwner ? (
        <Box sx={{ mt: 5 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {video ? (
              <video
                controls
                crossOrigin="anonymous"
                style={{ width: 800, height: 500, textAlign: 'center' }}
              >
                <source label="1080p" src={video} />
              </video>
            ) : null}
          </Box>
          <Divider sx={{ mt: 4, mb: 4 }} />
          <Box>
            {contentDecrypted ? (
              <DisplayContent data={contentDecrypted} />
            ) : (
              <Typography>No content yet</Typography>
            )}
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {certificationMinted ? (
              <SeeMyCertificateButton />
            ) : certificateLoading ? (
              <ButtonLoader />
            ) : (
              <MintCertificateButton />
            )}
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundImage: `${image}`,
          }}
        >
          <img
            src={image}
            alt="background_image"
            style={{
              marginTop: 5,
              border: 'solid',
              borderColor: 'black',
              width: 1200,
              height: 400,
              borderRadius: 10,
              objectFit: 'cover',
            }}
          />
          <Typography
            sx={{
              mt: 4,
              fontWeight: 'bold',
              fontSize: 25,
            }}
          >
            M {price}
          </Typography>
          {address ? (
            buying ? (
              <ButtonLoader />
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  alignItems: 'center',
                  backgroundColor: '#F87060',
                  fontWeight: 'bold',
                  mt: 2,
                  width: 160,
                  height: 45,
                  borderRadius: 30,
                  cursor: 'pointer',
                  ':hover': {
                    bgcolor: '#FEF7F0',
                    color: '#FD9D80',
                  },
                }}
                onClick={() => mintCourse()}
              >
                Buy the course
              </Box>
            )
          ) : (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: '#F87060',
                fontWeight: 'bold',
                mt: 2,
                width: 250,
                height: 45,
                borderRadius: 30,
                cursor: 'pointer',
                ':hover': {
                  bgcolor: '#FEF7F0',
                  color: '#FD9D80',
                },
              }}
              onClick={() => connectWalletAction()}
            >
              Log in to buy the course
            </Box>
          )}
        </Box>
      )}
    </Container>
  );
}
