import React from 'react';
import { Outlet } from 'react-router-dom';
import AccountSetting from '../../shared/AccountSetting'; // Sidebar

const AccountPage = () => {
  return (
    <div className='flex gap-6 p-10 mt-6 border-2 shadow-md rounded-3xl dark:bg-bgDiv'>
      {/* Sidebar */}
      <div className='w-1/5'>
        <AccountSetting />
      </div>

      {/* Main Content */}
      <div className='w-4/5'>
        {/* Đây là nơi sẽ hiển thị các nội dung phụ thuộc vào route con */}
        <Outlet />
      </div>
    </div>
  );
};

export default AccountPage;
