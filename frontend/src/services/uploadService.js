import api from './api';

/**
 * Upload category data with image
 * @param {FormData} formData - Form data including image file
 * @returns {Promise<Object>} - Server response
 */
export const uploadCategory = async (formData) => {
  try {
    const response = await api.post('/categories/category', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      'Error uploading category:',
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};
export const uploadSubCategory = async (formData) => {
  try {
    const response = await api.post('/subcategories/subcategory', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      'Error uploading category:',
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};
export const uploadWarehouse = async (formData) => {
  try {
    const response = await api.post('/warehouses/warehouse', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      'Error uploading category:',
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};
export const uploadProductType = async (formData) => {
  try {
    const response = await api.post('/subcategories/product-type', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      'Error uploading category:',
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};
export const uploadManufacturer = async (formData) => {
  try {
    const response = await api.post('/manufacturers/manufacturer', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      'Error uploading category:',
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};

/**
 * Generic upload function for various data types with image
 * @param {string} endpoint - API endpoint
 * @param {FormData} formData - Form data including image file
 * @returns {Promise<Object>} - Server response
 */
export const uploadData = async (endpoint, formData) => {
  try {
    const response = await api.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      `Error uploading to ${endpoint}:`,
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};
