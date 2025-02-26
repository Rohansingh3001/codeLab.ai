import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../screens/login';
import Register from '../screens/register'; // Import Register component
import Home from '../screens/Home';
import Project from '../screens/Project';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/project" element={<Project />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
