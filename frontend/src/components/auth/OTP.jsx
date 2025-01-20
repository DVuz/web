import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../common';
import Stepper from './StepperOTP';
import { useTranslationLoader } from '../../hooks/useTranslationLoader';
const OTP = ({ onClick }) => {
  useTranslationLoader('otp');
  const { t } = useTranslation('otp');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  // Hàm để xử lý thay đổi giá trị của các ô input
  const handleChange = (e, index) => {
    const value = e.target.value;

    // Chỉ cho phép nhập 1 ký tự
    if (value.match(/[0-9]/) && value.length === 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Chuyển sang ô tiếp theo nếu đã nhập giá trị
      if (index < 5) {
        document.getElementById(`otp-input-${index + 1}`).focus();
      }
    }
  };

  // Hàm để xử lý khi nhấn phím
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' || e.key === 'Delete') {
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);

      // Chuyển về ô trước nếu có
      if (index > 0) {
        document.getElementById(`otp-input-${index - 1}`).focus();
      }
    }
  };

  return (
    <div>
      <h2 className='font-bold text-xl my-1'>{t('otp_verification')}</h2>
      <p className='text-md font-lg my-1 '>{t('otp_sent_email')}</p>
      <div className='flex my-4 mx-auto space-x-2 justify-center'>
        {otp.map((digit, index) => (
          <input
            key={index}
            id={`otp-input-${index}`}
            type='text'
            maxLength='1'
            value={digit}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            autoComplete='off'
            className='w-12 h-12 text-center text-xl border border-gray-300 bg-gray-200 dark:bg-gray-700 dark:border-gray-600 rounded-md'
          />
        ))}
      </div>
      <Button context={t('verify_otp')} onClick={onClick} />
      <div className='flex justify-center'>
        <p className='text-gray-400 font-semibold'>
          {t('didnt_receive_otp')}{' '}
          <span className='dark:text-white text-black underline'>
            {t('resend_otp')}
          </span>
        </p>
      </div>
    </div>
  );
};

export default OTP;
