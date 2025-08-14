// components/ProtectedRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoute = () => {
  const userEmail = Cookies.get('email');

  if (!userEmail || userEmail === '0' || userEmail === undefined) {
    return <Navigate to="/" state={{ toastMessage: 'Please login or register to continue' }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;