import LanguageSwitcher from '../common/LanguageSwitcher';
import { FaMagnifyingGlassLocation } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';
import { Darkmode } from '../common';
import { useTranslationLoader } from '../../hooks/useTranslationLoader';
const Header = () => {
  useTranslationLoader('header');
  const { t } = useTranslation('header');
  return (
    <div className='mx-auto max-w-screen-2xl bg-from-green-400 via-green-500 dark:bg-gray-800 shadow-md flex items-center justify-between px-4 py-2 top-component'>
      <p className='text-lg font-semibold dark:text-white'>
        Cửa hàng đỗ gỗ Dương Dũng-DDStore
      </p>
      <div className='flex items-center space-x-4'>
        <p>Hotline: 0328715219</p>
        <p className='flex items-center'>
          <FaMagnifyingGlassLocation /> Địa chỉ
        </p>
      </div>
      <div className='flex items-center space-x-4'>
        <LanguageSwitcher />
        <Darkmode />
      </div>
    </div>
  );
};

export default Header;
