import React from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import { Header } from '../components/ui';
import Footer from '../components/shared/Footer';
import { Top } from '../components/ui';
const UserLayout = () => {
  const location = useLocation();
  const excludedPaths = [
    '/404',
    '/login',
    '/register',
    '/',
    '/contact',
    '/callingPersonal',
  ];
  const isExcludedPath = excludedPaths.includes(location.pathname);

  return (
    <>
      <Top />
      {!isExcludedPath && <Header />}
      <div className={isExcludedPath ? '' : 'mx-auto max-w-screen-2xl'}>
        <Outlet />
      </div>
      {!isExcludedPath && <Footer />}
    </>
  );
};

export default UserLayout;
