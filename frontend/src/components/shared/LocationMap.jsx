import React from 'react';
import { GoogleMap, LoadScript, MarkerF } from '@react-google-maps/api';

const mapStyles = {
  height: '250px',
  width: '100%',
};

// Tọa độ trung tâm của bản đồ
const defaultCenter = {
  lat: 20.386025,
  lng: 106.525926,
};
const LocationMap = () => {
  const key = import.meta.env.VITE_GG_APIKEY;
  return (
    <LoadScript googleMapsApiKey={key} className='rounded-2xl'>
      <GoogleMap mapContainerStyle={mapStyles} zoom={13} center={defaultCenter}>
        <MarkerF position={defaultCenter} />
      </GoogleMap>
    </LoadScript>
  );
};

export default LocationMap;
