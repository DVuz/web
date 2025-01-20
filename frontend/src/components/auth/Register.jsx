import { useTranslation } from 'react-i18next';
import facebook from '../../assets/facebook.png';
import { Input, Button, FormSelect } from '../common';
import { useState } from 'react';
import logo from '../../assets/logo.png';
import registerPage from '../../assets/register.png';
import { checkEmail } from '../../services/auth';
import { Link } from 'react-router-dom';
import OTP from '../auth/OTP';
import { useTranslationLoader } from '../../hooks/useTranslationLoader';
const Register = () => {
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [confirmPasswordValue, setConfirmPasswordValue] = useState('');
  const [fullNameValue, setFullNameValue] = useState('');
  const [genderValue, setGenderValue] = useState('');
  const [dateOfBirthValue, setDateOfBirthValue] = useState('');
  const [error, sertError] = useState('');
  const [isEmailExisted, setIsEmailExisted] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  useTranslationLoader('register');
  const { t } = useTranslation('register');
  const selectOptions = [
    { value: 'female', label: t('female') },
    { value: 'male', label: t('male') },
    { value: 'other', label: t('other') },
  ];
  // Kiểm tra xem tất cả các giá trị có không trống const
  const isFormValid =
    emailValue.trim() !== '' &&
    passwordValue.trim() !== '' &&
    confirmPasswordValue.trim() !== '' &&
    fullNameValue.trim() !== '' &&
    genderValue !== '' &&
    dateOfBirthValue.trim() !== '' &&
    isChecked;
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(passwordValue, confirmPasswordValue);
    if (passwordValue !== confirmPasswordValue) {
      console.log('saii');
      sertError('Password do not match');
    } else {
      const check = await checkEmail(emailValue);
      if (check === 'Email already exists') {
        setIsEmailExisted('Email already exists');
      } else {
        setIsEmailExisted('Email is available');
      }
      sertError('');
    }
  };
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked); // Đảo ngược trạng thái hiện tại
  };
  const OTPhandle = () => {
    console.log(
      emailValue,
      passwordValue,
      fullNameValue,
      genderValue,
      dateOfBirthValue
    );
  };
  return (
    <div
      className={`flex items-center justify-center h-full w-full m-auto mt-16`}
    >
      <div className='2xl:block 2xl:h-2/3  2xl:w-2/5 hidden '>
        <img
          src={registerPage}
          alt=''
          className='w-full h-full  rounded-xl hover:scale-110 transition-transform duration-300 transform'
        />
      </div>
      <div className='max-w-3xl bg-opacity-50 border border-gray-300 shadow-xl p-8 mx-12 rounded-xl dark:bg-gray-800 2xl:w-1/3  2xl:h-5/6  overflow-y-auto 2xl:overflow-hidden'>
        <div className='flex items-center'>
          <img src={logo} alt='Logo' className='w-16 h-16 rounded-xl mr-4' />
          <h1 className='text-4xl font-bold text-gray-800 dark:text-white'>
            DDStore
          </h1>
          {/* Dịch tên cửa hàng */}
        </div>
        <div className='mt-2'>
          <h2 className='text-2xl font-bold dark:text-white'>
            {t('create_your_account')}
          </h2>
          {/* Dịch tiêu đề */}
          <p className='pt-2 text-lg dark:text-white'>
            {t('start_your_website_in_seconds')}
            <Link to='/login'>
              <span className='text-green-700 font-semibold'>
                {t('login_here')}
              </span>
            </Link>
          </p>
          {/* Dịch mô tả */}
        </div>
        <div className='mt-2 2xl:flex 2xl:space-x-4 '>
          <div className='2xl:w-1/2 w-full my-2'>
            <Input
              inputValue={setFullNameValue}
              labelText={t('full_name')}
              typeInput='text'
            />
            {/* Dịch label email */}
          </div>
          <div className='2xl:w-1/2 w-full my-2'>
            <Input
              inputValue={setEmailValue}
              labelText={t('Emal')}
              typeInput={'email'}
            />
            {/* Dịch label password */}
            {isEmailExisted === 'Email already exists' && (
              <p className='mt-2 text-sm text-red-500 italic'>
                {isEmailExisted}
              </p>
            )}
          </div>
        </div>
        <div className='mt-2 2xl:flex 2xl:space-x-4 '>
          <div className='2xl:w-1/2 w-full my-2'>
            <Input
              inputValue={setConfirmPasswordValue}
              labelText={t('password')}
              typeInput='password'
            />
            {/* Dịch label email */}
          </div>
          <div className='2xl:w-1/2 w-full my-2'>
            <Input
              inputValue={setPasswordValue}
              labelText={t('confirm_password')}
              typeInput={'password'}
            />
            {/* Dịch label password */}
            <p className='mt-2 text-sm text-red-500 italic'>{error}</p>
          </div>
        </div>
        <div className='mt-2 2xl:flex 2xl:space-x-4 '>
          <div className='2xl:w-1/2 w-full my-2'>
            <Input
              inputValue={setDateOfBirthValue}
              labelText={t('date_of_birth')}
              typeInput='date'
            />
          </div>
          <div className='2xl:w-1/2 w-full my-2'>
            <FormSelect
              options={selectOptions}
              labelText={t('select_gender')}
              setlectValue={setGenderValue}
            />
          </div>
        </div>
        <div className='relative  inline-flex items-center justify-center w-full'>
          <hr className='w-full h-1 my-2 bg-gray-300 border-0 dark:bg-gray-700' />
          <span className='absolute px-3 font-medium text-gray-900 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-800'>
            or
          </span>
        </div>
        <div className='2xl:flex 2xl:space-x-4'>
          <button
            className='2xl:w-1/2 w-full my-4 justify-center rounded-md flex items-center border border-slate-300 py-2 px-4 text-center text-md transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-700 hover:border-slate-700 focus:text-white focus:bg-slate-700 focus:border-slate-700 active:border-slate-700 active:text-white active:bg-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none font-semibold'
            type='button'
          >
            <img
              src='https://docs.material-tailwind.com/icons/google.svg'
              alt='metamask'
              className='h-5 w-5 mr-2 font-semibold'
            />
            {t('sign_up_with')} Google
          </button>
          <button
            className='2xl:w-1/2 w-full my-4 justify-center rounded-md flex items-center border border-slate-300 py-2 px-4 text-center text-md transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-700 hover:border-slate-700 focus:text-white focus:bg-slate-700 focus:border-slate-700 active:border-slate-700 active:text-white active:bg-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none font-semibold'
            type='button'
          >
            <img
              src={facebook}
              alt='metamask'
              className='h-5 w-5 mr-2 font-medium'
            />
            {t('sign_up_with')} Facebook
          </button>
        </div>
        <div className='flex-row items-center justify-between mb-4'>
          <div className='flex items-start mb-4'>
            <input
              id='default-checkbox'
              type='checkbox'
              checked={isChecked}
              onChange={handleCheckboxChange}
              className='w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 accent-green-500 mt-1'
            />
            <label
              htmlFor='default-checkbox'
              className='ms-2 text-md font-medium text-gray-900 dark:text-gray-300'
            >
              {t('by_signing_up_part1')}
              <a href='/terms-of-use' className='text-blue-600'>
                {t('terms_of_use')}
              </a>
              {t('and')}
              <a href='/privacy-policy' className='text-blue-600'>
                {t('privacy_policy')}
              </a>
              {t('by_signing_up_part2')}
            </label>
          </div>
          <div className='flex items-start mb-4'>
            <input
              id='default-checkbox'
              type='checkbox'
              value=''
              className='w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 accent-green-500 mt-1'
            />
            <label
              htmlFor='default-checkbox'
              className='ms-2 text-md font-medium text-gray-900 dark:text-gray-300'
            >
              {t('email_me_updates')}
            </label>
          </div>
        </div>
        <Button
          context={t('create_an_account')}
          disabled={!isFormValid}
          onClick={handleSubmit}
        />
      </div>
      {isEmailExisted === 'Email is available' && (
        <div className='fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50'>
          <OTP onClick={OTPhandle} />
        </div>
      )}
    </div>
  );
};
export default Register;
