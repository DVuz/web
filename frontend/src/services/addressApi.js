// api/addressApi.js
import api from './api';

export const createOrUpdateAddress = async (addressData, accessToken) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response = await api.post('/api/address', addressData, config);

    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.message || 'API Error');
    }
  } catch (error) {
    console.error('Address API Error:', error.message);
    throw error;
  }
};