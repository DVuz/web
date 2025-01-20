import { useState } from 'react';
import Input from '../../../common/Input';
import { uploadWarehouse } from '../../../../services/uploadService';
import { toast, ToastContainer } from 'react-toastify'; // Thêm import
import 'react-toastify/dist/ReactToastify.css'; // Thêm styles

import Toast from '../../../common/ToastDemo'; // Thêm import

export default function WarehouseForm() {
  const [toasts, setToasts] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    is_active: true,
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  const addToast = (type, message, description = '') => {
    const newToast = {
      id: Date.now(),
      type,
      message,
      description,
    };
    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
    if (!formData.name.trim()) {
      newErrors.name = 'Warehouse name is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    }

    // Image validation
    if (!formData.image) {
      newErrors.image = 'Warehouse image is required';
    }

    // Set errors and check if form is valid
    setErrors(newErrors);

    // Log validation results
    if (Object.keys(newErrors).length > 0) {
      console.log('Form validation failed:', newErrors);
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        setErrors((prev) => ({
          ...prev,
          image: 'Image size should not exceed 5MB',
        }));
        return;
      }

      if (!file.type.startsWith('image/')) {
        setErrors((prev) => ({
          ...prev,
          image: 'Please upload an image file',
        }));
        return;
      }

      setFormData((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setErrors((prev) => ({ ...prev, image: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      addToast('error', 'Validation Error', 'Please check all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const formPayload = new FormData();
      formPayload.append('name', formData.name);
      formPayload.append('address', formData.address);
      formPayload.append('phone', formData.phone);
      formPayload.append('email', formData.email);
      formPayload.append('is_active', formData.is_active);
      if (formData.image) {
        formPayload.append('image', formData.image);
      }

      const response = await uploadWarehouse(formPayload);

      addToast(
        'success',
        'Warehouse Created',
        'Warehouse has been created successfully!'
      );

      // Reset form
      setFormData({
        name: '',
        address: '',
        phone: '',
        email: '',
        is_active: true,
        image: null,
      });
      setImagePreview(null);
      setErrors({});
    } catch (error) {
      console.error('Submission error:', error);
      addToast(
        'error',
        'Error',
        error.message || 'Failed to create warehouse. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleReset = () => {
    setFormData({
      name: '',
      address: '',
      phone: '',
      email: '',
      is_active: true,
      image: null,
    });
    setImagePreview(null);
    setErrors({});
  };

  return (
    <div className='flex-1 p-8 bg-gray-50 overflow-y-auto h-full'>
      {/* Render toasts */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          type={toast.type}
          message={toast.message}
          description={toast.description}
          onClose={() => removeToast(toast.id)}
        />
      ))}
      <div className='max-w-4xl mx-auto'>
        {/* Header Section */}
        <div className='mb-6'>
          <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
            Create New Warehouse
          </h1>
          <p className='mt-1 text-sm text-gray-600 dark:text-gray-400'>
            Add a new warehouse location to your system.
          </p>
        </div>

        {/* Main Form Card */}
        <div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700'>
          <div className='p-6'>
            <form onSubmit={handleSubmit} className='space-y-8'>
              {/* Basic Information Section */}
              <div>
                <h2 className='text-lg font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700'>
                  Basic Information
                </h2>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <Input
                    labelText='Warehouse Name'
                    typeInput='text'
                    placeholder='e.g., Main Distribution Center'
                    inputValue={(value) =>
                      setFormData((prev) => ({ ...prev, name: value }))
                    }
                    value={formData.name} // Add this
                    error={errors.name}
                  />

                  <Input
                    labelText='Email Address'
                    typeInput='email'
                    placeholder='e.g., warehouse@company.com'
                    inputValue={(value) =>
                      setFormData((prev) => ({ ...prev, email: value }))
                    }
                    value={formData.email} // Add this
                    error={errors.email}
                  />

                  {/* Image Upload Section */}
                  <div className='md:col-span-2'>
                    <div className='space-y-2'>
                      <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                        Warehouse Image
                      </label>
                      <div className='mt-1 flex items-center space-x-4'>
                        <div className='flex items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-700'>
                          {imagePreview ? (
                            <img
                              src={imagePreview}
                              alt='Preview'
                              className='w-full h-full object-cover'
                            />
                          ) : (
                            <div className='text-center p-4'>
                              <svg
                                className='mx-auto h-12 w-12 text-gray-400'
                                stroke='currentColor'
                                fill='none'
                                viewBox='0 0 48 48'
                              >
                                <path
                                  d='M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02'
                                  strokeWidth={2}
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                />
                              </svg>
                              <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
                                Upload image
                              </p>
                            </div>
                          )}
                        </div>
                        <div className='flex-1'>
                          <input
                            type='file'
                            accept='image/*'
                            onChange={handleImageChange}
                            className='hidden'
                            id='warehouse-image'
                          />
                          <label
                            htmlFor='warehouse-image'
                            className='inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600'
                          >
                            Choose File
                          </label>
                          {errors.image && (
                            <p className='mt-1 text-sm text-red-600 dark:text-red-500'>
                              {errors.image}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Details Section */}
              <div>
                <h2 className='text-lg font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700'>
                  Contact Details
                </h2>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <Input
                    labelText='Phone Number'
                    typeInput='tel'
                    placeholder='e.g., +1-800-555-0199'
                    inputValue={(value) =>
                      setFormData((prev) => ({ ...prev, phone: value }))
                    }
                    value={formData.phone} // Add this
                    error={errors.phone}
                  />

                  <div className='md:col-span-2'>
                    <Input
                      labelText='Warehouse Address'
                      typeInput='textarea'
                      placeholder='Full address including street, city, state, and zip code'
                      inputValue={(value) =>
                        setFormData((prev) => ({ ...prev, address: value }))
                      }
                      value={formData.address} // Add this
                      error={errors.address}
                    />
                  </div>
                </div>
              </div>

              {/* Status Section */}
              <div>
                <h2 className='text-lg font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700'>
                  Warehouse Status
                </h2>
                <div className='space-y-2'>
                  <label className='inline-flex items-center'>
                    <input
                      type='checkbox'
                      className='rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50'
                      checked={formData.is_active}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          is_active: e.target.checked,
                        }))
                      }
                    />
                    <span className='ml-2 text-sm text-gray-700 dark:text-gray-300'>
                      Active Warehouse
                    </span>
                  </label>
                </div>
              </div>

              {/* Form Actions */}
              <div className='flex justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700'>
                <button
                  type='button'
                  onClick={handleReset}
                  className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600'
                >
                  Reset Form
                </button>

                <button
                  type='submit'
                  disabled={isSubmitting}
                  className='px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2'
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className='animate-spin h-4 w-4 text-white'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                      >
                        <circle
                          className='opacity-25'
                          cx='12'
                          cy='12'
                          r='10'
                          stroke='currentColor'
                          strokeWidth='4'
                        />
                        <path
                          className='opacity-75'
                          fill='currentColor'
                          d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                        />
                      </svg>
                      <span>Creating...</span>
                    </>
                  ) : (
                    <span>Create Warehouse</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Preview Card */}
        {formData.name && (
          <div className='mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6'>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
              Preview
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
              {imagePreview && (
                <div className='md:col-span-2 mb-4'>
                  <img
                    src={imagePreview}
                    alt='Warehouse'
                    className='w-48 h-48 object-cover rounded-lg border border-gray-200 dark:border-gray-700'
                  />
                </div>
              )}

              <div>
                <p className='text-gray-500 dark:text-gray-400'>
                  Warehouse Name
                </p>
                <p className='font-medium text-gray-900 dark:text-white'>
                  {formData.name}
                </p>
              </div>
              <div>
                <p className='text-gray-500 dark:text-gray-400'>Status</p>
                <p className='font-medium text-gray-900 dark:text-white'>
                  {formData.is_active ? 'Active' : 'Inactive'}
                </p>
              </div>
              <div>
                <p className='text-gray-500 dark:text-gray-400'>Phone</p>
                <p className='font-medium text-gray-900 dark:text-white'>
                  {formData.phone}
                </p>
              </div>
              <div>
                <p className='text-gray-500 dark:text-gray-400'>Email</p>
                <p className='font-medium text-gray-900 dark:text-white'>
                  {formData.email}
                </p>
              </div>
              <div className='md:col-span-2'>
                <p className='text-gray-500 dark:text-gray-400'>Address</p>
                <p className='font-medium text-gray-900 dark:text-white'>
                  {formData.address}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
