import React from 'react';
import { useTranslation } from 'react-i18next';
import DDStoreFurniture from '../../assets/image/DDStore_Furniture.png';
import { useTranslationLoader } from '../../hooks/useTranslationLoader';
const AboutUsPage = () => {
  useTranslationLoader('about_us');
  const { t } = useTranslation('about_us');
  return (
    <div className='mt-12'>
      <h1 className='mb-2 text-4xl font-bold'>{t('title')}</h1>
      <p
        className='text-lg font-medium'
        dangerouslySetInnerHTML={{ __html: t('introduction') }}
      ></p>
      <div className='flex ml-24 x-1/4'>
        <img
          src={DDStoreFurniture}
          alt='Furniture'
          className='object-cover w-1/5 mx-auto mt-4 rounded-3xl'
        />

        {/* Our Story */}
        <div className='mt-4 ml-8 '>
          <h2 className='mb-4 text-2xl font-semibold '>
            {t('our_story.title')}
          </h2>
          <p
            className='text-lg font-medium leading-relaxed '
            dangerouslySetInnerHTML={{ __html: t('our_story.content') }}
          ></p>
        </div>
      </div>

      {/* Our Mission */}
      <div className='mt-4'>
        <h2 className='mb-2 text-2xl font-bold'>{t('our_mission.title')}</h2>
        <p
          className='text-lg font-medium'
          dangerouslySetInnerHTML={{ __html: t('our_mission.content') }}
        ></p>
        <ul className='mt-2 list-disc list-inside'>
          <li
            className='text-lg font-medium'
            dangerouslySetInnerHTML={{
              __html: t('our_mission.commitments.natural_materials'),
            }}
          ></li>
          <li
            className='text-lg font-medium'
            dangerouslySetInnerHTML={{
              __html: t('our_mission.commitments.exquisite_craftsmanship'),
            }}
          ></li>
          <li
            className='text-lg font-medium'
            dangerouslySetInnerHTML={{
              __html: t('our_mission.commitments.sophisticated_designs'),
            }}
          ></li>
        </ul>
      </div>

      {/* Core Values */}
      <div className='mt-4'>
        <h2 className='mb-2 text-2xl font-bold'>{t('core_values.title')}</h2>
        <p
          className='text-lg font-medium'
          dangerouslySetInnerHTML={{
            __html: t('core_values.customer_dedication'),
          }}
        ></p>
        <p
          className='text-lg font-medium'
          dangerouslySetInnerHTML={{
            __html: t('core_values.exceptional_quality'),
          }}
        ></p>
        <p
          className='text-lg font-medium'
          dangerouslySetInnerHTML={{
            __html: t('core_values.tradition_innovation'),
          }}
        ></p>
      </div>

      {/* Our Team */}
      <div className='mt-4'>
        <h2 className='mb-2 text-2xl font-bold'>{t('our_team.title')}</h2>
        <p
          className='text-lg font-medium'
          dangerouslySetInnerHTML={{ __html: t('our_team.content') }}
        ></p>
      </div>

      {/* Our Products */}
      <div className='mt-4'>
        <h2 className='mb-2 text-2xl font-bold'>{t('our_products.title')}</h2>
        <p
          className='text-lg font-medium'
          dangerouslySetInnerHTML={{ __html: t('our_products.content') }}
        ></p>
        <ul className='mt-2 list-disc list-inside'>
          {Array.isArray(
            t('our_products.product_list', { returnObjects: true })
          )
            ? t('our_products.product_list', { returnObjects: true }).map(
                (item, index) => (
                  <li key={index} className='text-lg font-medium'>
                    {item}
                  </li>
                )
              )
            : null}
        </ul>
      </div>

      {/* Conclusion */}
      <div className='mt-4'>
        <p
          className='text-lg font-medium'
          dangerouslySetInnerHTML={{ __html: t('conclusion') }}
        ></p>
      </div>
    </div>
  );
};

export default AboutUsPage;
