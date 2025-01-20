import React from 'react';
import { useTranslation } from 'react-i18next';
import homeImg from '../../assets/Image/home.jpg';
import { useTranslationLoader } from '../../hooks/useTranslationLoader';
const HomeBanner = () => {
  useTranslationLoader('homeBanner');
  const { t } = useTranslation('homeBanner');
  return (
    <div className='relative left-0 w-full bg-mainGreen  z-10'>
      <div className='mx-auto max-w-screen-2xl pt-36 flex w-full'>
        <div className='w-2/5'>
          <div className='flex items-baseline space-x-4'>
            <p className='text-mainYellow text-6xl font-bold leading-none'>
              {t('interior')}
              <span className='text-3xl font-semibold text-white leading-none'>
                {t('enhancing_living_spaces')}
              </span>
            </p>
          </div>
          <div className='mt-4'>
            <p className='text-2xl text-white'>{t('description')}</p>
          </div>

          <div className='mt-12'>
            <button className='bg-mainYellow p-4 rounded-full text-xl'>
              <i className='fa-solid fa-cart-shopping-fast mr-2'></i>
              {t('shop_now')}
            </button>

            {/* Phần thống kê 1500+ và 999+ */}
            <div className='mt-6 flex justify-center '>
              <div className='flex flex-col items-center justify-center mr-14'>
                <p className='text-4xl text-mainYellow font-bold'>1500+</p>
                <p className='text-center text-white text-xl font-medium'>
                  {t('diverse_products')}
                </p>
              </div>
              <div className='flex flex-col items-center justify-center'>
                <p className='text-4xl text-mainYellow font-bold'>999+</p>
                <p className='text-center text-white text-xl font-medium'>
                  {t('customers')}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className='w-3/5 mb-[-50px]'>
          <img src={homeImg} alt='' className='w-full animate-bounce ' />
        </div>
      </div>
    </div>
  );
};

export default HomeBanner;
