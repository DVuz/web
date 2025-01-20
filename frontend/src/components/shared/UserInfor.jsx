import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTranslationLoader } from '../../hooks/useTranslationLoader';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { logOut as logoutService } from '../../services/auth';

const UserInfor = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  useTranslationLoader('userInfor');
  const { t } = useTranslation('userInfor');
  console.log(user);
  const baseUrl = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      const response = await logoutService();
      console.log(response);
      logout();
      setIsOpen(false);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!user) {
    return null;
  }

  const { decodedToken } = user;
  const userRole = decodedToken.user_role;

  const truncateEmail = (email) => {
    if (email.length > 20) {
      const [username, domain] = email.split('@');
      const truncatedUsername = username.slice(0, 10);
      return `${truncatedUsername}...@${domain}`;
    }
    return email;
  };

  return (
    <div
      className='relative flex items-center justify-center gap-2 z-50'
      ref={dropdownRef}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='flex items-center justify-center w-10 h-10 rounded-full hover:bg-blue-300 dark:hover:bg-[#245632]'
      >
        <svg
          className='w-6 h-6'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
          />
        </svg>
      </button>
      <span className='text-white'>|</span>

      {isOpen && (
        <div className='absolute top-16 -right-24 w-72 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-[#042F2C] dark:border-gray-700'>
          <div className='p-4 border-b border-gray-200 dark:border-gray-700'>
            <div className='flex items-center gap-3'>
              <div className='flex items-center justify-center w-16 h-16 rounded-full'>
                <img
                  src={`${decodedToken.avatar || '/default-avatar.jpg'}`}
                  alt=''
                  className='object-cover w-full h-full rounded-xl'
                />
              </div>
              <div className='overflow-hidden'>
                <h3 className='font-bold text-mainYellow truncate'>
                  {decodedToken.user_name}
                </h3>
                <p className='text-sm truncate' title={decodedToken.email}>
                  {truncateEmail(decodedToken.email)}
                </p>
                <p className='text-sm text-gray-500'>
                  {decodedToken.user_role}
                </p>
              </div>
            </div>
          </div>

          <div className='px-4 py-4 space-y-2'>
            {/* Mục cài đặt (dành cho tất cả vai trò) */}
            <Link
              to='/account'
              className='block w-full px-4 py-2 text-left rounded-xl hover:bg-blue-100 dark:hover:bg-[#245632]'
            >
              {t('settings')}
            </Link>

            {/* Mục dành riêng cho Customer */}
            {userRole === 'Customer' && (
              <Link
                to='/shoppingcart'
                className='block w-full px-4 py-2 text-left rounded-xl hover:bg-blue-100 dark:hover:bg-[#245632]'
              >
                Giỏ hàng
              </Link>
            )}

            {/* Mục dành riêng cho Delivery */}
            {userRole === 'Delivery' && (
              <>
                <Link
                  to='/shipping'
                  className='block w-full px-4 py-2 text-left rounded-xl hover:bg-blue-100 dark:hover:bg-[#245632]'
                >
                  Vận chuyển
                </Link>
                <Link
                  to='/shoppingcart'
                  className='block w-full px-4 py-2 text-left rounded-xl hover:bg-blue-100 dark:hover:bg-[#245632]'
                >
                  Giỏ hàng
                </Link>
              </>
            )}

            {/* Mục dành riêng cho Admin */}
            {userRole === 'Admin' && (
              <>
                <Link
                  to='/admin/dashboard'
                  className='block w-full px-4 py-2 text-left rounded-xl hover:bg-blue-100 dark:hover:bg-[#245632]'
                >
                  Quản lý cửa hàng
                </Link>
                <Link
                  to='/messenger'
                  className='block w-full px-4 py-2 text-left rounded-xl hover:bg-blue-100 dark:hover:bg-[#245632]'
                >
                  Tin nhắn
                </Link>
                <Link
                  to='/shipping'
                  className='block w-full px-4 py-2 text-left rounded-xl hover:bg-blue-100 dark:hover:bg-[#245632]'
                >
                  Vận chuyển
                </Link>
                <Link
                  to='/shoppingcart'
                  className='block w-full px-4 py-2 text-left rounded-xl hover:bg-blue-100 dark:hover:bg-[#245632]'
                >
                  Giỏ hàng
                </Link>
              </>
            )}

            {/* Mục trợ giúp */}
            <button className='w-full px-4 py-2 text-left rounded-xl hover:bg-blue-100 dark:hover:bg-[#245632]'>
              {t('help_center')}
            </button>
            <hr className='my-4 border-gray-200 dark:border-gray-700' />

            {/* Nút đăng xuất */}
            <button
              onClick={handleLogout}
              className='w-full px-4 py-2 text-left rounded-xl hover:bg-blue-300 dark:hover:bg-red-500'
            >
              {t('logout')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInfor;
