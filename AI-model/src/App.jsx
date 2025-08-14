import React from 'react';
import NexusAuth from './pages/Auth';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ProtectedRoute from './middleware/Check';
import CheckRoute from './middleware/Middleware';

function App() {
  return (
    <Router>
      <Routes>
        {/* Correct syntax: use `path` instead of `to` and put the component inside `element` */}
        <Route element={<CheckRoute/>}>
             <Route path="/" element={<NexusAuth />} />
        </Route>
       
        <Route element={<ProtectedRoute/>}>

            <Route path ='/home' element={<Home/>}/>
        </Route>
        
      </Routes>
    </Router>
  );
}

export default App;
