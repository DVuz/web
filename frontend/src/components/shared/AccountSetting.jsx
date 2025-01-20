import React from 'react';
import { useTranslation } from 'react-i18next';
import { PiUserListBold } from 'react-icons/pi';

import { BiSolidLock } from 'react-icons/bi';
import { SlBell } from 'react-icons/sl';
import { NavLink } from 'react-router-dom';
import { useTranslationLoader } from '../../hooks/useTranslationLoader';

const AccountSetting = () => {
  useTranslationLoader('AccountSetting');
  const { t } = useTranslation('AccountSetting');

  // Function to add a custom active class to the NavLink
  const activeLinkStyle = 'bg-blue-100 dark:bg-[#245632]';

  return (
    <div className='w-full '>
      <div className='px-4 space-y-2'>
        <NavLink
          to='personInfo'
          className={({ isActive }) =>
            `w-full px-4 py-2 text-left rounded-xl flex items-center gap-2 ${isActive ? activeLinkStyle : ''}`
          }
        >
          <PiUserListBold className='p-2 text-4xl font-bold border rounded-xl' />
          {t('profile')}
        </NavLink>
        <NavLink
          to='security'
          className={({ isActive }) =>
            `w-full px-4 py-2 text-left rounded-xl flex items-center gap-2 ${isActive ? activeLinkStyle : ''}`
          }
        >
          <BiSolidLock className='p-2 text-4xl font-bold border rounded-xl' />
          {t('security')}
        </NavLink>
        <NavLink
          to='security'
          className={({ isActive }) =>
            `w-full px-4 py-2 text-left rounded-xl flex items-center gap-2 ${isActive ? activeLinkStyle : ''}`
          }
        >
          <SlBell className='p-2 text-4xl font-bold border rounded-xl' />
          {t('notification')}
        </NavLink>
      </div>
    </div>
  );
};

export default AccountSetting;
