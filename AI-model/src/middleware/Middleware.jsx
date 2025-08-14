import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';

const CheckRoute = () => {
  const userEmail = Cookies.get('email');

  if (userEmail && userEmail !== '0') {
    // Already logged in → go to home
    return <Navigate to="/home" replace />;
  }

  // Not logged in → allow / to render
  return <Outlet />;
};

export default CheckRoute;