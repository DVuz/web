// src/AuthWrapper/AuthWrapper.jsx
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const AuthWrapper = ({ children, adminRequired = false }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(user === null);
  }, [user]);

  if (isLoading) {
    return null;
  }

  if (!user) {
    return <Navigate to='/login' replace />;
  }

  // Check for admin role if required
  if (adminRequired && user.decodedToken?.user_role !== 'Admin') {
    console.error('Admin role required');
    return <Navigate to='/' replace />;
  }

  return children;
};

export default AuthWrapper;
