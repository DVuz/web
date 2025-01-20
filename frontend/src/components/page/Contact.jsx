import React from 'react';
import Header from '../ui/Header.jsx';
import Footer from '../shared/Footer.jsx';
import { GoogleMap, LoadScript, MarkerF } from '@react-google-maps/api';
import { FaMapLocation, FaClock } from 'react-icons/fa6';
import { MdEmail, MdContactPhone } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { Input, Button } from '../common';
import { useTranslationLoader } from '../../hooks/useTranslationLoader';
const mapStyles = {
  height: '600px',
  width: '100%',
};

// Tọa độ trung tâm của bản đồ
const defaultCenter = {
  lat: 20.386025,
  lng: 106.525926,
};
const Contact = () => {
  const key = import.meta.env.VITE_GG_APIKEY;
  useTranslationLoader('contact');
  const { t } = useTranslation('contact');
  return (
    <div>
      <Header />
      <div className='mt-12 '>
        <div className='z-0'>
          <LoadScript
            googleMapsApiKey={key} // Thay thế bằng API key của bạn
          >
            <GoogleMap
              mapContainerStyle={mapStyles}
              zoom={13}
              center={defaultCenter}
            >
              <MarkerF position={defaultCenter} />
            </GoogleMap>
          </LoadScript>
        </div>
        <div className='max-w-screen-2xl mx-auto'>
          <div className='border-2 p-12 shadow-2xl rounded-2xl grid grid-cols-2 gap-4 -mt-48 relative z-10 bg-white dark:bg-[#042F2C] dark:text-mainGreen'>
            <div className='bg-[#f2b949] p-6 rounded-2xl '>
              <h1 className='text-4xl font-bold mb-2'>{t('title')}</h1>
              <p className='text-xl flex items-start'>
                <FaMapLocation className='text-2xl mr-4' />
                {t('address')}
              </p>
              <p className='text-xl flex items-start  mt-2'>
                <MdEmail className='text-2xl mr-4' />
                vutrandung02062002@gmail.com
              </p>
              <p className='text-xl flex items-start  mt-2'>
                <MdContactPhone className='text-2xl mr-4' />
                052352124
              </p>
              <p className='text-xl flex items-start  mt-2'>
                <FaClock className='text-2xl mr-4' />
                {t('working_hours')}
              </p>
            </div>

            <div>
              <h1 className='text-4xl font-bold text-white '>
                {t('contact_us')}
              </h1>
              <div className='grid grid-cols-2 gap-4 mt-2'>
                <Input typeInput='text' labelText={t('full_name')} />
                <Input typeInput='email' labelText='email' />
              </div>
              <div className='mt-4'>
                <Input
                  typeInput='phone'
                  labelText={t('phone_number')}
                  className=''
                />
              </div>
              <div className='mt-4'>
                <Input typeInput='text' labelText={t('subject')} />
              </div>
              <div className='mt-4'>
                <Input typeInput='textarea' labelText={t('message')} />
              </div>
              <div className='mt-4 w-48'>
                <Button context={t('send_info')} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
