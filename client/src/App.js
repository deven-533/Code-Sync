import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React from 'react';
import { Toaster } from 'react-hot-toast'


import './App.css';
import Home from './pages/Home';
import IDE from './pages/IDE';

function App() {
  return (
    <>
      <div>
        <Toaster
          position='top-center'
          toastOptions={
            {
              success: {
                theme: {
                  primary: 'green',
                }
              }
            }
          }
        >
        </Toaster>
      </div>

      <Router>
        <Routes>
          <Route exact path="/" element={<Home />}></Route>
          <Route exact path="/room/:id" element={<IDE/>}></Route>

        </Routes>
      </Router>
    </>
  );
}

export default App;
