import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdLockOutline } from 'react-icons/md';
import { Input, Button } from '../common';
import { useTranslationLoader } from '../../hooks/useTranslationLoader';
import axios from 'axios';
import useAuth from '../../hooks/useAuth';
import Toast from '../../components/common/ToastDemo'; // Import your Toast component

const Security = () => {
  useTranslationLoader('uploadFile');
  const { t } = useTranslation('uploadFile');
  const { user } = useAuth();

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [toastConfig, setToastConfig] = useState(null);

  const handlePasswordChange = (field) => (value) => {
    setPasswordForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (formErrors[field]) {
      setFormErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const validatePassword = (password) => {
    if (password.length < 8 || password.length > 16) {
      return 'Password must be between 8 and 16 characters';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return 'Password must contain at least one special character';
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number';
    }
    return '';
  };

  const showToast = (message, type = 'success', description = '') => {
    setToastConfig({
      message,
      type,
      description,
      duration: 3000,
      onClose: () => setToastConfig(null),
    });
  };

  const handleSubmit = async () => {
    setFormErrors({});

    // Validate form
    const errors = {};
    if (!passwordForm.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    if (!passwordForm.newPassword) {
      errors.newPassword = 'New password is required';
    } else {
      const passwordError = validatePassword(passwordForm.newPassword);
      if (passwordError) {
        errors.newPassword = passwordError;
      }
    }
    if (!passwordForm.confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password';
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      showToast('Please fix the form errors', 'error');
      return;
    }

    const accessToken = user.accessToken;
    const userEmail = user.decodedToken.email;

    if (!accessToken || !userEmail) {
      showToast('Please log in again', 'error');
      return;
    }

    setIsLoading(true);
    showToast('Changing password...', 'loading');

    try {
      const response = await axios.put(
        `https://192.168.0.102:3000/api/auth/change_password`,
        {
          email: userEmail,
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        showToast('Password changed successfully', 'success');
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        'An error occurred while changing password';
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // AuthMethod component remains the same
  const AuthMethod = ({ icon, title, description }) => (
    <div className='flex items-center gap-6 p-6 transition-all duration-300 bg-white border rounded-lg hover:shadow-lg hover:border-mainYellow'>
      <div className='flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full'>
        {icon}
      </div>
      <div className='flex-1'>
        <h2 className='text-xl font-bold text-gray-800'>{title}</h2>
        <p className='mt-1 text-gray-600'>{description}</p>
      </div>
      <Button
        context='Connect'
        onClick={() => {
          showToast(`Connecting to ${title}...`, 'loading');
          // Simulate connection delay
          setTimeout(() => {
            showToast(`Connected to ${title}`, 'success');
          }, 2000);
        }}
      />
    </div>
  );

  return (
    <div className='w-full p-6'>
      {toastConfig && <Toast {...toastConfig} />}

      <section className='mb-12'>
        <div className='flex items-center gap-3 mb-6'>
          <MdLockOutline className='w-8 h-8 text-mainYellow' />
          <h1 className='text-3xl font-bold text-mainYellow'>Password</h1>
        </div>

        <div className='p-6 bg-white rounded-lg shadow-sm'>
          <div className='space-y-6'>
            <Input
              labelText='Current Password'
              typeInput='password'
              placeholder='Enter current password'
              value={passwordForm.currentPassword}
              inputValue={handlePasswordChange('currentPassword')}
              error={formErrors.currentPassword}
            />

            <Input
              labelText='New Password'
              typeInput='password'
              placeholder='Enter new password'
              value={passwordForm.newPassword}
              inputValue={handlePasswordChange('newPassword')}
              error={formErrors.newPassword}
            />

            <Input
              labelText='Confirm New Password'
              typeInput='password'
              placeholder='Confirm new password'
              value={passwordForm.confirmPassword}
              inputValue={handlePasswordChange('confirmPassword')}
              error={formErrors.confirmPassword}
            />
          </div>

          <div className='flex justify-end mt-6'>
            <Button
              context={isLoading ? 'Saving...' : 'Save Changes'}
              onClick={handleSubmit}
              disabled={isLoading}
            />
          </div>
        </div>
      </section>

      {/* Authentication section remains the same */}
      <section className='space-y-6'>
        <div className='flex items-center gap-3'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='w-8 h-8 text-mainYellow'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
            />
          </svg>
          <h1 className='text-3xl font-bold text-mainYellow'>Authentication</h1>
        </div>

        <p className='text-xl text-gray-600'>Available Login Methods</p>

        <div className='space-y-4'>
          <AuthMethod
            icon={
              <svg
                xmlns='http://www.w3.org/2000/svg'
                height='24'
                viewBox='0 0 24 24'
                width='24'
              >
                <path
                  d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                  fill='#4285F4'
                />
                <path
                  d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                  fill='#34A853'
                />
                <path
                  d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                  fill='#FBBC05'
                />
                <path
                  d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                  fill='#EA4335'
                />
              </svg>
            }
            title='Google Authenticator'
            description='Using Google Authenticator app generates time-sensitive codes for secure logins.'
          />

          <AuthMethod
            icon={
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                fill='currentColor'
                viewBox='0 0 16 16'
              >
                <path d='M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z' />
              </svg>
            }
            title='X (Twitter) Authentication'
            description='Sign in securely using your X (formerly Twitter) account credentials.'
          />
        </div>
      </section>
    </div>
  );
};

export default Security;
