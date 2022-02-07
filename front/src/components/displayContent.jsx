import React, { Component, useEffect, useState } from 'react';
import MUIRichTextEditor from 'mui-rte'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import {
  Box,
} from '@mui/material';

export default function DisplayContent({ data }) {

  const myTheme = createTheme({
    readOnly: true
  })

  return (
    <Box sx={{ ml: '15%', mr: '15%' }}>
      <ThemeProvider theme={myTheme}>
        <MUIRichTextEditor
          defaultValue={JSON.parse(data)}
          readOnly={true}
          controls={['']}
        />
      </ThemeProvider>
    </Box>
  );
}