import React from 'react';
import { useTranslation } from 'react-i18next';
import inspirationImg from '../../assets/image/bed.png';
import { useTranslationLoader } from '../../hooks/useTranslationLoader';

const Inspiration = () => {
  useTranslationLoader('Inspiration');
  const { t } = useTranslation('Inspiration');
  return (
    <div className='relative h-96 w-full my-12'>
      <img
        src={inspirationImg}
        alt=''
        className='h-96 w-full object-cover rounded-2xl'
      />
      {/* Lớp phủ màu đen */}
      <div className='absolute inset-0 bg-black bg-opacity-50 rounded-2xl'></div>
      {/* Nội dung hiển thị */}
      <div className='absolute inset-0 flex flex-col items-center justify-center text-center w-3/5 mx-auto'>
        <h2 className='text-5xl mb-4 font-bold text-mainYellow uppercase'>
          {t('title')}
        </h2>
        <p className='text-2xl font-semibold text-white leading-relaxed'>
          {t('description')}
        </p>
      </div>
    </div>
  );
};

export default Inspiration;
