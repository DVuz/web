import React, { useState, useEffect } from 'react';
import { MdOutlineCloudUpload } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { Input, FormSelect, Button } from '../common';
import { useTranslationLoader } from '../../hooks/useTranslationLoader';
import useAuth from '../../hooks/useAuth';
import { getUserInfoByEmail } from '../../services/getApi';

const PersonalInformation = () => {
  useTranslationLoader('uploadFile');
  const { t } = useTranslation('uploadFile');
  const defaultAvatar = 'https://192.168.0.102:3000/api/media/test/f.jpg';

  const { user } = useAuth();
  const [formData, setFormData] = useState({
    user_name: '',
    email: '',
    phone: '',
    language: 'vietnamese',
    gender: '',
    avatar_link: defaultAvatar,
    date_of_birth: '',
  });

  const [formErrors, setFormErrors] = useState({
    user_name: '',
    email: '',
    phone: '',
    language: '',
    gender: '',
    date_of_birth: '',
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(defaultAvatar);
  const [errorMessage, setErrorMessage] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  console.log(user);
  const [hasCustomAvatar, setHasCustomAvatar] = useState(false);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserInfoByEmail(user.accessToken);
        if (response.success && response.user) {
          const formattedDate = response.user.date_of_birth
            ? new Date(response.user.date_of_birth).toISOString().split('T')[0]
            : '';

          // Check if user has a custom avatar
          const hasCustom =
            response.user.avatar_link &&
            !response.user.avatar_link.includes('default.jpg') &&
            !response.user.avatar_link.includes('test/f.jpg');

          setHasCustomAvatar(hasCustom);
          setFormData((prev) => ({
            ...prev,
            user_name: response.user.user_name || '',
            email: response.user.email || '',
            phone: response.user.phone || '',
            language: response.user.language || 'en',
            gender: response.user.gender || '',
            avatar_link: response.user.avatar_link || defaultAvatar,
            date_of_birth: formattedDate,
          }));
          setPreviewUrl(response.user.avatar_link || defaultAvatar);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setErrorMessage('Failed to load user data');
      }
    };

    if (user?.accessToken) {
      fetchUserData();
    }
  }, [user]);

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    return phoneRegex.test(phone);
  };

  const validateForm = () => {
    const errors = {
      user_name: !formData.user_name.trim() ? 'Username is required' : '',
      email: !formData.email.trim()
        ? 'Email is required'
        : !validateEmail(formData.email)
          ? 'Invalid email format'
          : '',
      phone: !formData.phone.trim()
        ? 'Phone is required'
        : !validatePhone(formData.phone)
          ? 'Invalid phone format'
          : '',
      gender: !formData.gender ? 'Gender is required' : '',
      language: !formData.language ? 'Language is required' : '',
      date_of_birth: !formData.date_of_birth ? 'Date of birth is required' : '',
    };

    setFormErrors(errors);

    // Check if there are any errors
    const hasErrors = Object.values(errors).some((error) => error !== '');
    setIsFormValid(!hasErrors);

    return !hasErrors;
  };

  useEffect(() => {
    validateForm();
  }, [formData]);

  const validateImage = (file) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      throw new Error(
        'Invalid file type. Only JPG, PNG, and GIF files are allowed.'
      );
    }

    if (file.size > maxSize) {
      throw new Error('File size exceeds 5MB limit.');
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      validateImage(file);

      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      setAvatarFile(file);
      setHasCustomAvatar(true); // Set to true when file is uploaded
      setErrorMessage('');

      return () => URL.revokeObjectURL(objectUrl);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleRemoveAvatar = () => {
    if (hasCustomAvatar || avatarFile) {
      setPreviewUrl(defaultAvatar);
      setAvatarFile(null);
      setHasCustomAvatar(false);
      setFormData((prev) => ({
        ...prev,
        avatar_link: 'uploads/avatars/default.jpg', // Set to default avatar path
      }));
      setErrorMessage('');
    }
  };

  const buttonClass = (isDisabled, activeColor) =>
    `flex items-center w-auto px-4 py-2 font-bold text-white rounded-2xl 
    ${isDisabled ? 'bg-gray-400 cursor-not-allowed' : `${activeColor} cursor-pointer hover:brightness-110`}`;

  const languageOptions = [
    { value: 'vietnamese', label: t('Vietnamese') },
    { value: 'english', label: t('English') },
  ];

  const genderOptions = [
    { value: 'Male', label: t('Male') },
    { value: 'Female', label: t('Female') },
    { value: 'Other', label: t('Other') },
  ];

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const submitData = new FormData();

      // Add all form fields except avatar_link
      Object.keys(formData).forEach((key) => {
        if (key !== 'avatar_link') {
          submitData.append(key, formData[key]);
        }
      });

      // Only append avatar if there's a new file
      if (avatarFile) {
        submitData.append('avatar', avatarFile);
      } else if (!hasCustomAvatar) {
        // If no custom avatar and no new file, explicitly set to default
        submitData.append('avatar_action', 'default');
      }
      // If hasCustomAvatar is true and no new file, keep existing avatar

      const response = await fetch(
        'https://192.168.0.102:3000/api/users/update_user_with_avatar',
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
          body: submitData,
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      console.log('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrorMessage('Failed to update profile');
    }
  };

  return (
    <div className='w-full mt-2 mx-auto'>
      <h1 className='text-3xl font-bold text-mainYellow'>
        {t('Personal Information')}
      </h1>

      {/* Avatar Section */}
      <div className='flex flex-col mt-4'>
        <div className='flex items-center gap-6'>
          <img
            src={
              previewUrl.startsWith('/uploads')
                ? `https://192.168.0.102:3000${previewUrl}`
                : previewUrl
            }
            alt='Avatar'
            className='border-4 rounded-full w-28 h-28 object-cover'
          />

          <div className='space-y-4'>
            <div className='flex gap-4'>
              <button>
                <label className={buttonClass(false, 'bg-green-500')}>
                  <MdOutlineCloudUpload className='w-6 h-6 mr-2' />
                  {t('uploadFile')}
                  <input
                    type='file'
                    onChange={handleFileChange}
                    className='hidden'
                    accept='.jpg,.jpeg,.png,.gif'
                  />
                </label>
              </button>

              <button
                className={buttonClass(
                  !hasCustomAvatar && !avatarFile,
                  'bg-red-500'
                )}
                onClick={handleRemoveAvatar}
                disabled={!hasCustomAvatar && !avatarFile}
              >
                {t('Remove')}
              </button>
            </div>
            <p className='text-gray-600 text-sm'>
              {t('Allowed JPG, GIF or PNG')}
            </p>
          </div>
        </div>
        {errorMessage && (
          <p className='mt-2 text-red-500 text-sm'>{errorMessage}</p>
        )}
      </div>

      {/* Form Fields */}
      <div className='mt-6 space-y-4'>
        <div className='flex flex-col gap-4 md:flex-row'>
          <div className='w-full'>
            <Input
              labelText={t('Username')}
              typeInput='text'
              value={formData.user_name}
              error={formErrors.user_name}
              inputValue={(value) =>
                setFormData((prev) => ({ ...prev, user_name: value }))
              }
            />
          </div>
        </div>

        <div className='flex flex-col gap-4 md:flex-row'>
          <div className='w-full md:w-1/2'>
            <Input
              labelText={t('Email')}
              typeInput='email'
              value={formData.email}
              error={formErrors.email}
              inputValue={(value) =>
                setFormData((prev) => ({ ...prev, email: value }))
              }
            />
          </div>
          <div className='w-full md:w-1/2'>
            <Input
              labelText={t('Phone')}
              typeInput='tel'
              value={formData.phone}
              error={formErrors.phone}
              inputValue={(value) =>
                setFormData((prev) => ({ ...prev, phone: value }))
              }
            />
          </div>
        </div>

        <div className='flex flex-col gap-4 md:flex-row'>
          <div className='w-full md:w-1/2'>
            <Input
              labelText={t('Date of Birth')}
              typeInput='date'
              value={formData.date_of_birth}
              error={formErrors.date_of_birth}
              inputValue={(value) =>
                setFormData((prev) => ({ ...prev, date_of_birth: value }))
              }
            />
          </div>
          <div className='w-full md:w-1/2'>
            <FormSelect
              labelText={t('Gender')}
              options={genderOptions}
              value={formData.gender}
              error={formErrors.gender}
              setlectValue={(value) =>
                setFormData((prev) => ({ ...prev, gender: value }))
              }
            />
          </div>
        </div>

        <div className='flex flex-col gap-4 md:flex-row'>
          <div className='w-full'>
            <FormSelect
              labelText={t('Language')}
              options={languageOptions}
              value={formData.language}
              error={formErrors.language}
              setlectValue={(value) =>
                setFormData((prev) => ({ ...prev, language: value }))
              }
            />
          </div>
        </div>

        <div className='flex justify-end mt-6'>
          <Button
            className='mt-4'
            context={t('Save Changes')}
            onClick={handleSubmit}
            disabled={!isFormValid}
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalInformation;
