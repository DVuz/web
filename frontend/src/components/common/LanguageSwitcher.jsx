// src/components/LanguageSwitcher.js

import { useLanguage } from '../../contexts/LanguageContext'; // Import context
import vietNamFlag from '../../assets/flag/VietNamFlag.png';
import englishFlag from '../../assets/flag/UKFlag.png';
import cnFlag from '../../assets/flag/ChinaFlag.png';

const LanguageSwitcher = () => {
  const { changeLanguage } = useLanguage();

  return (
    <div className='flex items-center space-x-2'>
      <button onClick={() => changeLanguage('en')}>
        <img src={englishFlag} alt='English' className='w-7 h-5 rounded-md' />
      </button>
      <span className='font-medium text-lg'>/</span>
      <button onClick={() => changeLanguage('vi')}>
        <img src={vietNamFlag} alt='Việt Nam' className='w-7 h-5 rounded-md' />
      </button>
      <span className='font-medium text-lg'>/</span>
      <button onClick={() => changeLanguage('zh')}>
        <img src={cnFlag} alt='Việt Nam' className='w-7 h-5 rounded-md' />
      </button>
    </div>
  );
};

export default LanguageSwitcher;
