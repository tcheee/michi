import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
} from '@mui/material';
import { CardActionArea } from '@mui/material';
import Gridloader from './Gridloader';

export default function DisplayNFT({
  lessons,
  displayPrice = false,
  creatorInformation = false,
}) {
  const navigate = useNavigate();
  const selectCourse = (lesson) => {
    navigate(`/courses`, { state: lesson });
  };

  return (
    <>
      {lessons.length > 0 ? (
        <Grid
          container
          spacing={3}
          sx={{ mt: '10px', overflow: 'auto', maxHeight: { xs: 380, sm: 690 } }}
        >
          {' '}
          {lessons.map((lesson) => (
            <Grid
              item
              xs={12}
              md={6}
              lg={3}
              key={lesson.address}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Card sx={{ width: 310, height: 430, border: 0 }}>
                <CardActionArea
                  sx={{ height: 430 }}
                  onClick={() => selectCourse(lesson)}
                >
                  <CardMedia
                    component="img"
                    height="250"
                    image={lesson.background_image}
                    alt="background-image"
                    sx={{ borderBottom: 1 }}
                  />
                  <CardContent>
                    <Typography
                      gutterBottom
                      component="div"
                      sx={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        mb: 4,
                        height: '5vh',
                      }}
                    >
                      {lesson.name.length > 50
                        ? lesson.name.slice(0, 50) + '...'
                        : lesson.name}
                    </Typography>
                    {creatorInformation ? null : (
                      <Typography
                        sx={{
                          fontSize: 12,
                          color: '#CDD7D6',
                          fontWeight: 'bold',
                          marginTop: 1,
                        }}
                      >
                        Created by{' '}
                        {lesson.author
                          ? lesson.author.slice(0, 5) +
                          '...' +
                          lesson.author.slice(-5)
                          : '0x000...00000'}
                      </Typography>
                    )}
                    <Typography
                      variant="body2"
                      sx={{
                        height: '4vh',
                        fontSize: 12,
                        marginTop: 1,
                      }}
                    >
                      {creatorInformation
                        ? null
                        : lesson.description.length > 100
                          ? lesson.description.slice(0, 100) + '...'
                          : lesson.description}
                    </Typography>
                    {displayPrice ? (
                      <Box>
                        <Typography
                          sx={{
                            fontWeight: 'bold',
                            fontSize: 22,
                            marginTop: 2,
                            textAlign: 'right',
                          }}
                        >
                          M {lesson.price}
                        </Typography>
                      </Box>
                    ) : null}
                    {creatorInformation ? (
                      <Box
                        sx={{
                          mt: 2,
                          paddingTop: 1,
                        }}
                      >
                        <Typography sx={{ fontWeight: 'bold' }}>
                          Courses sold:{' '}
                          <span style={{ color: '#FD9D80' }}>
                            {lesson.numberSold}
                          </span>
                        </Typography>
                        <Typography sx={{ fontWeight: 'bold' }}>
                          Revenues available:
                          <span style={{ color: '#FD9D80' }}>
                            {' '}
                            M {lesson.amount}{' '}
                          </span>
                        </Typography>
                      </Box>
                    ) : null}
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Gridloader />
      )}
    </>
  );
}
