import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/page/adminpage/AdminSidebar';
import { Top } from '../components/ui';

const AdminLayout = () => {
  return (
    <div className='flex h-screen bg-gray-100  gap-4'>
      <AdminSidebar />
      <main className='flex-1 overflow-x-hidden overflow-y-auto shadow-sm w-screen bg-gray-100'>
        <Top />
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
