import { useTranslation } from 'react-i18next';
import facebook from '../../assets/facebook.png';
import { Input, Button } from '../common';
import { useState, useEffect } from 'react';
import logo from '../../assets/logo.png';
import loginPage from '../../assets/loginPage.png';
import { Link } from 'react-router-dom';
import { login as loginService } from '../../services/auth';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useTranslationLoader } from '../../hooks/useTranslationLoader';

const Login = () => {
  useTranslationLoader('login');
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const { t } = useTranslation('login'); // Sử dụng hook và chỉ định namespace 'login'
  const [error, setError] = useState('');
  const { login } = useAuth();

  const navigate = useNavigate(); // Thêm hook useNavigate

  useEffect(() => {
    document.title = t('title');
    const accessToken = localStorage.getItem('accessToken');
    console.log(accessToken);
    if (accessToken) {
      navigate('/', { replace: true }); // Sử dụng navigate thay vì Navigate
    }
  }, [t, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(emailValue, passwordValue);
  };
  const validatePassword = (password) => {
    if (password.length < 8 || password.length > 16) {
      return 'Mật khẩu phải có từ 8 đến 16 ký tự.';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Mật khẩu phải chứa ít nhất một ký tự chữ hoa.';
    }
    if (!/[a-z]/.test(password)) {
      return 'Mật khẩu phải chứa ít nhất một ký tự chữ thường.';
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return 'Mật khẩu phải chứa ít nhất một ký tự đặc biệt.';
    }
    if (!/[0-9]/.test(password)) {
      return 'Mật khẩu phải chứa ít nhất một chữ số.';
    }
    return '';
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Clear any existing errors

    try {
      const response = await loginService(emailValue, passwordValue);

      if (!response.success) {
        // Handle unsuccessful login
        setError(response.message || 'Đăng nhập thất bại');
        return;
      }

      // Handle successful login
      login(response);
      navigate('/', { replace: true });
    } catch (error) {
      // Handle API errors
      if (error.response && error.response.data) {
        setError(error.response.data.message || 'Đăng nhập thất bại');
      } else {
        setError('Đã có lỗi xảy ra. Vui lòng thử lại sau.');
      }
    }
  };
  const isFormValid = emailValue.trim() !== '' && passwordValue.trim() !== '';
  return (
    <div className='flex items-center justify-center w-full h-full m-auto mt-28 '>
      <div className='max-w-3xl p-10 mx-12 overflow-y-auto bg-opacity-50 border border-gray-300 shadow-xl rounded-xl dark:bg-gray-800 2xl:w-1/3 2xl:h-2/3'>
        <div className='flex items-center'>
          <img src={logo} alt='Logo' className='w-16 h-16 mr-4 rounded-xl' />
          <h1 className='text-4xl font-bold text-gray-800 dark:text-white'>
            DDStore
          </h1>
          {/* Dịch tên cửa hàng */}
        </div>
        <div className='mt-4'>
          <h2 className='text-2xl font-bold dark:text-white'>
            {t('welcome_back')}
          </h2>
          {/* Dịch tiêu đề */}
          <p className='pt-2 text-lg dark:text-white'>
            {t('start_your_website_in_seconds')}
            <Link to='/register'>
              <span className='font-semibold text-green-700'>
                {t('sign_up')}
              </span>
            </Link>
          </p>
          {/* Dịch mô tả */}
        </div>
        {error && (
          <div className='p-3 mb-4 text-sm text-red-500 bg-red-100 border border-red-400 rounded'>
            {error}
          </div>
        )}
        <div className='mt-2 2xl:flex 2xl:space-x-4 '>
          <div className='w-full my-2 2xl:w-1/2'>
            <Input
              inputValue={setEmailValue}
              value={emailValue} // Đồng bộ state với input
              labelText={t('Email')}
              typeInput='email'
              placeholder={t('Email')}
            />
          </div>
          <div className='w-full my-2 2xl:w-1/2'>
            <Input
              inputValue={setPasswordValue}
              value={passwordValue} // Đồng bộ state với input
              labelText={t('password')}
              typeInput='password'
              placeholder={t('password')}
            />
            {/* Dịch label password */}
          </div>
        </div>
        <div className='relative inline-flex items-center justify-center w-full'>
          <hr className='w-full h-1 my-4 bg-gray-300 border-0 dark:bg-gray-700' />
          <span className='absolute px-3 font-medium text-gray-900 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-800'>
            or
          </span>
        </div>
        <div className='2xl:flex 2xl:space-x-4'>
          <button
            className='flex items-center justify-center w-full px-4 py-2 my-4 font-semibold text-center transition-all border rounded-md shadow-sm 2xl:w-1/2 border-slate-300 text-md hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-700 hover:border-slate-700 focus:text-white focus:bg-slate-700 focus:border-slate-700 active:border-slate-700 active:text-white active:bg-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none'
            type='button'
          >
            <img
              src='https://docs.material-tailwind.com/icons/google.svg'
              alt='metamask'
              className='w-5 h-5 mr-2 font-semibold'
            />
            {t('sign_in_with')} Google
          </button>
          <button
            className='flex items-center justify-center w-full px-4 py-2 my-4 font-semibold text-center transition-all border rounded-md shadow-sm 2xl:w-1/2 border-slate-300 text-md hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-700 hover:border-slate-700 focus:text-white focus:bg-slate-700 focus:border-slate-700 active:border-slate-700 active:text-white active:bg-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none'
            type='button'
          >
            <img
              src={facebook}
              alt='metamask'
              className='w-5 h-5 mr-2 font-medium'
            />
            {t('sign_in_with')} Facebook
          </button>
        </div>
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center mb-4'>
            <input
              id='default-checkbox'
              type='checkbox'
              value=''
              className='w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 accent-green-500'
            />
            <label
              htmlFor='default-checkbox'
              className='font-medium text-gray-900 ms-2 text-md dark:text-gray-300'
            >
              {t('remember_me')}
            </label>
          </div>
          <Link to='/forgotPassword'>
            <p className='font-medium text-green-700 text-md'>
              {t('forgot_password')}
            </p>
          </Link>
        </div>
        <Button
          context={t('sign_in_to_your_account')}
          onClick={handleLogin}
          disabled={!isFormValid}
        />
      </div>
      <div className='hidden 2xl:block 2xl:h-2/3 2xl:w-1/3'>
        <img
          src={loginPage}
          alt=''
          className='w-full h-full transition-transform duration-300 transform rounded-xl hover:scale-110'
        />
      </div>
    </div>
  );
};

export default Login;
