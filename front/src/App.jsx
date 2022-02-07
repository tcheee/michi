import Footer from './components/Footer.jsx';
import React, { useEffect } from 'react';
import Header from './components/Header.jsx';
import Homepage from './views/homepage.jsx';
import Form from './views/form.jsx';
import Coursepage from './views/coursepage.jsx';
import MyNFT from './views/myNFT.jsx';
import MyDasboard from './views/mydashboard.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ContextProvider from './context/stateContext';

function App() {
  return (
    <ContextProvider>
      <Router>
        <Header />
        <Routes>
          <Route exact path="/form" element={<Form />} />
          <Route exact path="/mynft" element={<MyNFT />} />
          <Route exact path="/courses-created" element={<MyDasboard />} />
          <Route exact path="/courses" element={<Coursepage />} />
          <Route path="*" element={<Homepage />} />
        </Routes>
      </Router>
    </ContextProvider>
  );
}

export default App;
