import React from 'react';
import { useTranslation } from 'react-i18next';
import error from '../../assets/error/eror.png';
import { Button } from '../common';

const Error404 = () => {
  const { t } = useTranslation('pageError');

  return (
    <div className='flex flex-col items-center justify-center min-h-screen text-center'>
      <img
        src={error}
        alt=''
        className='w-3/5 h-3/5 object-cover mb-4 rounded-xl'
      />
      <h2 className='text-4xl font-bold dark:text-white mb-2'>
        {t('message')}
      </h2>
      <p className='text-xl font-bold my-1 mb-4 w-2/5'>{t('description')}</p>
      <div className='w-48'>
        <Button context={t('text')} />
      </div>
    </div>
  );
};

export default Error404;
