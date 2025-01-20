import { useState } from 'react';
import { Input, Button } from '../common';
import { useTranslation } from 'react-i18next';
import Stepper from './StepperOTP';
import OTP from './OTP';
import SetNewPassword from './SetNewPassword';
import ForgotPasswordImage from '../../assets/auth/ForgotPassword.png';

const ForgetPassword = () => {
  const { t } = useTranslation('forgotPassword');
  const [email, setEmail] = useState('');
  const [isClicked, setIsClicked] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const handleButtonClick = () => {
    setIsClicked(true);
  };

  const handleCurrentStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };
  return (
    <div
      className='flex items-center justify-center h-screen bg-center bg-no-repeat bg-cover'
      style={{
        backgroundImage: `url(${ForgotPasswordImage})`, // Áp dụng ảnh nền
      }}
    >
      <div className='p-12 bg-white border border-gray-300 shadow-xl dark:text-white rounded-xl dark:bg-gray-800'>
        <div className='mb-6'>
          <Stepper currentStep={currentStep} />
        </div>
        {currentStep === 1 && (
          <>
            {isClicked ? (
              <div>
                <h2 className='my-1 text-xl font-bold'>
                  {t('check_your_email')}
                </h2>
                <p className='my-1 font-semibold text-md '>
                  {t('password_recovery_sent')}
                </p>
                <div className='my-4'>
                  <Button
                    context={t('processing')}
                    onClick={handleCurrentStep}
                  />
                </div>
                <div className='flex justify-center'>
                  <p className='font-semibold text-gray-600'>
                    {t('back_to')}{' '}
                    <span className='text-black underline dark:text-white'>
                      {t('sign_in_text')}
                    </span>
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <h2 className='my-1 text-xl font-bold'>
                  {t('forgot_password')}
                </h2>
                <p className='my-1 text-md font-lg '>
                  {t('enter_email_to_receive_code')}
                </p>
                <div className='my-4'>
                  <Input
                    inputValue={setEmail}
                    labelText={t('Email')}
                    typeInput={'email'}
                  />
                </div>
                <div className='my-4'>
                  <Button context={t('submit')} onClick={handleButtonClick} />
                </div>
                <div className='flex justify-center'>
                  <p className='mr-2 font-semibold text-gray-600'>
                    {t('back_to')}{' '}
                  </p>
                  <p className='font-semibold text-black underline dark:text-white'>
                    {t('sign_in_text')}
                  </p>
                </div>
              </div>
            )}
          </>
        )}
        {currentStep === 2 && <OTP onClick={handleCurrentStep} />}
        {currentStep === 3 && <SetNewPassword />}
      </div>
    </div>
  );
};

export default ForgetPassword;
