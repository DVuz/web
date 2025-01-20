import React from 'react';
import { Input, Button } from '../common';
import { useTranslation } from 'react-i18next';
import Stepper from './StepperOTP';
import ForgotPasswordImage from '../../assets/auth/ForgotPassword.png'; // Import ảnh nền
import { useTranslationLoader } from '../../hooks/useTranslationLoader';
const SetNewPassword = () => {
  useTranslationLoader('setNewPassword');
  const { t } = useTranslation('setNewPassword');
  return (
    <div>
      <h2 className='my-1 text-xl font-bold'>
        {t('set_new_password_heading')}
      </h2>
      <p className='my-1 text-md font-lg '>{t('new_password_differs')}</p>
      <div className='my-4'>
        <Input labelText={t('password')} typeInput={'password'} />
      </div>
      <div className='my-4'>
        <Input labelText={t('confirm_password')} typeInput={'password'} />
      </div>
      <div className='my-4'>
        <Button context={t('confirm_password')} />
      </div>
      {/* <div className='flex justify-center'>
        <p className='font-semibold text-gray-600'>
          {t('back_to')}
          <span className='text-black underline dark:text-white'>
            {t('sign_in_text')}
          </span>
        </p>
      </div> */}
    </div>
  );
};

export default SetNewPassword;
