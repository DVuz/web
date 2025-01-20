import React from 'react';
import { useTranslation } from 'react-i18next';
import { MdModeEditOutline, MdLock } from 'react-icons/md';
import { Button } from '../common';

const UserDetail = () => {
  const { t } = useTranslation('userDetail');
  return (
    <div className='w-full xl:w-1/5 lg:w-full border border-gray-300 shadow-lg rounded-xl p-6 bg-white'>
      <div className='flex justify-end'>
        <MdModeEditOutline className='bg-slate-300 p-2 w-10 h-10 rounded-full cursor-pointer hover:bg-slate-400' />
      </div>

      <div className='flex flex-row items-center lg:flex-row lg:items-center xl:flex-col xl:items-center mt-4'>
        <img
          src='https://i.pinimg.com/736x/6c/e9/d4/6ce9d4f46eee84eea6d3c74749cf7393.jpg'
          alt='User Avatar'
          className='rounded-full w-24 h-24 object-cover mb-4 xl:mb-4 lg:mr-4'
        />
        <h2 className='text-2xl font-bold text-gray-800'>Dzung Vu</h2>
      </div>

      <div className='mt-6 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-1 gap-4'>
        <div>
          <p className='text-sm text-gray-500'>{t('Email')}</p>
          <p className='text-md font-semibold text-gray-800'>
            Dzungvu@gmail.com
          </p>
        </div>
        <div>
          <p className='text-sm text-gray-500'>{t('Phone')}</p>
          <p className='text-md font-semibold text-gray-800'>032421212</p>
        </div>
        <div>
          <p className='text-sm text-gray-500'>{t('DateOfBirth')}</p>
          <p className='text-md font-semibold text-gray-800'>02/06/2002</p>
        </div>
        <div>
          <p className='text-sm text-gray-500'>{t('LastOnline')}</p>
          <p className='text-md font-semibold text-gray-800'>02/06/2002</p>
        </div>
        <div>
          <p className='text-sm text-gray-500'>{t('RegistrationDate')}</p>
          <p className='text-md font-semibold text-gray-800'>02/06/2002</p>
        </div>
        <div>
          <p className='text-sm text-gray-500'>{t('Role')}</p>
          <p className='text-md font-semibold text-gray-800'>Khách hàng</p>
        </div>
      </div>

      <div className='mt-6 flex flex-col space-y-2'>
        <Button context={t('SendMessage')} />
        <Button context={t('LockAccount')} color={'red'} Icon={MdLock} />
      </div>
    </div>
  );
};

export default UserDetail;
