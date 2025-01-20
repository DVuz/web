import React from 'react';
import { Navigate } from 'react-router-dom';
import { Login, Register, ForgetPassword } from './components/auth';
import Text from './components/text';
import Error404 from './components/Error/Error404';
import Copy from './components/Copy';
import HomePage from './components/page/HomePage';
import AboutUsPage from './components/page/AboutUsPage';
import Contact from './components/page/Contact';
import Test from './components/test';
import AuthWrapper from './AuthWrapper/AuthWrapper';
import AccountPage from './components/page/userpage/AccountPage';
import PersonalInformation from './components/shared/PersonalInformation';
import AddressInformation from './components/shared/AddressInformation';
import Security from './components/shared/Security';
import Messenger from './components/page/userpage/Messenger';

// Helper function to automatically wrap routes with AuthWrapper
const wrapProtectedRoutes = (routes) => {
  return routes.map((route) => {
    if (route.children) {
      return {
        ...route,
        element: <AuthWrapper>{route.element}</AuthWrapper>,
        children: route.children, // Children inherit protection from parent
      };
    }
    return {
      ...route,
      element: <AuthWrapper>{route.element}</AuthWrapper>,
    };
  });
};

// Public routes that don't require authentication
export const publicRoutes = [
  { path: '/', element: <HomePage /> },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '/forgotPassword', element: <ForgetPassword /> },
  { path: '/404', element: <Error404 /> },
  { path: '/about_us', element: <AboutUsPage /> },
  { path: '/contact', element: <Contact /> },

  //tạm thoi
  { path: '/messenger', element: <Messenger /> },
];

// Protected routes configuration without manual AuthWrapper
const protectedRoutesConfig = [
  { path: '/text', element: <Text /> },
  {
    path: '/copy',
    element: <Copy />,
  },
  { path: '/test', element: <Test /> },
  {
    path: '/account',
    element: <AccountPage />,
    children: [
      {
        index: true,
        element: <Navigate to='personInfo' replace />,
      },
      {
        path: 'personInfo',
        element: (
          <div className='space-y-6'>
            <PersonalInformation />
            <AddressInformation />
          </div>
        ),
      },
      {
        path: 'security',
        element: <Security />,
      },
    ],
  },
];

// Automatically wrap protected routes with AuthWrapper
export const protectedRoutes = wrapProtectedRoutes(protectedRoutesConfig);

// Combine all routes for export
const routes = [...publicRoutes, ...protectedRoutes];

export default routes;
