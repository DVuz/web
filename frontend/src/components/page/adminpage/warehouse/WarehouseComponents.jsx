import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import Toast from '../../../common/ToastDemo';

export const ActionTooltip = ({ text, children }) => {
  return (
    <div className='relative group'>
      {children}
      <div
        className='absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded 
        opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50'
      >
        {text}
        <div className='absolute bottom-0 left-1/2 -translate-x-1/2 -mb-1 border-4 border-t-gray-900 border-x-transparent border-b-transparent' />
      </div>
    </div>
  );
};

export const InfoTooltip = ({ data, position }) => {
  if (!position) return null;

  return (
    <div
      className='fixed z-50 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 min-w-80'
      style={{
        left: `${position.x + 10}px`,
        top: `${position.y}px`,
        transform: 'translate(0, -50%)',
      }}
    >
      <div className='border-b border-gray-200 dark:border-gray-700 pb-3'>
        <h3 className='font-semibold text-gray-900 dark:text-white'>
          {data.name}
        </h3>
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            data.is_active
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}
        >
          {data.is_active ? 'Active' : 'Inactive'}
        </span>
      </div>

      <div className='mt-3 space-y-2'>
        {data.image_url && (
          <div className='mb-3'>
            <img
              src={`${import.meta.env.VITE_BACKEND_URL}${data.image_url}`}
              alt={data.name}
              className='w-full h-48 object-cover rounded-lg'
            />
          </div>
        )}
        <div className='grid grid-cols-2 gap-2 text-sm'>
          <div>
            <p className='text-gray-500 dark:text-gray-400'>ID</p>
            <p className='text-gray-900 dark:text-white'>#{data.id}</p>
          </div>
          <div>
            <p className='text-gray-500 dark:text-gray-400'>Email</p>
            <p className='text-gray-900 dark:text-white'>{data.email}</p>
          </div>
          <div>
            <p className='text-gray-500 dark:text-gray-400'>Phone</p>
            <p className='text-gray-900 dark:text-white'>{data.phone}</p>
          </div>
          <div>
            <p className='text-gray-500 dark:text-gray-400'>Created</p>
            <p className='text-gray-900 dark:text-white'>
              {new Date(data.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className='mt-2'>
          <p className='text-gray-500 dark:text-gray-400'>Address</p>
          <p className='text-gray-900 dark:text-white'>{data.address}</p>
        </div>
      </div>
    </div>
  );
};

export const DeleteModal = ({ show, onClose, onConfirm, warehouseName }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 300));
      await onConfirm();
      onClose();
      setShowToast(true);
    } catch (error) {
      console.error('Delete failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {show && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 max-w-md w-full mx-4'>
            <div className='flex justify-between items-center mb-4'>
              <h3 className='text-lg font-semibold'>Confirm Delete</h3>
              <button
                onClick={onClose}
                className='text-gray-500 hover:text-gray-700'
                disabled={isLoading}
              >
                <X className='w-5 h-5' />
              </button>
            </div>
            <p className='text-gray-600 mb-6'>
              Are you sure you want to delete warehouse "{warehouseName}"? This
              action cannot be undone.
            </p>
            <div className='flex justify-end gap-4'>
              <button
                onClick={onClose}
                className='px-4 py-2 text-gray-600 border rounded hover:bg-gray-50 disabled:opacity-50'
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className='px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 flex items-center gap-2'
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className='w-4 h-4 animate-spin' />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {showToast && (
        <Toast
          message='Warehouse deleted successfully'
          type='success'
          duration={3000}
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  );
};

export const EditModal = ({ show, onClose, warehouse, onSave }) => {
  const [formData, setFormData] = useState(warehouse || {});
  const [imagePreview, setImagePreview] = useState(
    warehouse?.image_url || null
  );
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (warehouse) {
      setFormData(warehouse);
      setImagePreview(warehouse.image_url);
    }
  }, [warehouse]);

  if (!show) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
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
    const formPayload = new FormData();

    Object.keys(formData).forEach((key) => {
      if (key === 'image' && formData[key] instanceof File) {
        formPayload.append('image', formData[key]);
      } else if (key !== 'image_url' && key !== 'image') {
        formPayload.append(key, formData[key]);
      }
    });

    onSave(formPayload);
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto'>
        <div className='flex justify-between items-center mb-4'>
          <h3 className='text-lg font-semibold'>Edit Warehouse</h3>
          <button
            onClick={onClose}
            className='text-gray-500 hover:text-gray-700'
          >
            <X className='w-5 h-5' />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Image Upload Section */}
          <div className='mb-6'>
            <label className='block text-sm font-medium mb-2'>
              Warehouse Image
            </label>
            <div className='flex items-center gap-4'>
              <div className='w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden flex items-center justify-center bg-gray-50'>
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt='Preview'
                    className='w-full h-full object-cover'
                  />
                ) : (
                  <div className='text-center p-4'>
                    <p className='text-sm text-gray-500'>No image</p>
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
                  className='inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 cursor-pointer'
                >
                  Choose New Image
                </label>
                {errors.image && (
                  <p className='mt-1 text-sm text-red-600'>{errors.image}</p>
                )}
              </div>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
            <div>
              <label className='block text-sm font-medium mb-1'>Name</label>
              <input
                type='text'
                value={formData.name || ''}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className='w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium mb-1'>Email</label>
              <input
                type='email'
                value={formData.email || ''}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className='w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium mb-1'>Phone</label>
              <input
                type='tel'
                value={formData.phone || ''}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className='w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium mb-1'>Status</label>
              <select
                value={formData.is_active ? 'true' : 'false'}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    is_active: e.target.value === 'true',
                  })
                }
                className='w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              >
                <option value='true'>Active</option>
                <option value='false'>Inactive</option>
              </select>
            </div>
            <div className='md:col-span-2'>
              <label className='block text-sm font-medium mb-1'>Address</label>
              <textarea
                value={formData.address || ''}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className='w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                rows='3'
                required
              />
            </div>
          </div>

          <div className='flex justify-end gap-4'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 text-gray-600 border rounded hover:bg-gray-50'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
