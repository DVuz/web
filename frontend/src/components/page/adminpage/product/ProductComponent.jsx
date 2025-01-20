import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';

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
      className='fixed z-50 bg-white p-4 rounded-lg shadow-xl border border-gray-200 min-w-80'
      style={{
        left: `${position.x + 10}px`,
        top: `${position.y}px`,
        transform: 'translate(0, -50%)',
      }}
    >
      <div className='border-b border-gray-200 pb-3'>
        <h3 className='font-semibold text-gray-900'>{data.product_name__en}</h3>
        <p className='text-sm text-gray-500'>{data.product_name_vn}</p>
      </div>

      <div className='mt-3 space-y-2'>
        <div className='mb-3'>
          <img
            src={data.main_image}
            alt={data.product_name__en}
            className='w-full h-48 object-cover rounded-lg'
          />
        </div>

        <div className='grid grid-cols-2 gap-2 text-sm'>
          <div>
            <p className='text-gray-500'>Code</p>
            <p className='text-gray-900'>#{data.product_code}</p>
          </div>
          <div>
            <p className='text-gray-500'>Price</p>
            <p className='text-gray-900'>${data.price}</p>
          </div>
          <div>
            <p className='text-gray-500'>Material</p>
            <p className='text-gray-900'>{data.material}</p>
            <p className='text-sm text-gray-500'>{data.material_vn}</p>
          </div>
          <div>
            <p className='text-gray-500'>Color</p>
            <p className='text-gray-900'>{data.color}</p>
            <p className='text-sm text-gray-500'>{data.color_vn}</p>
          </div>
        </div>

        <div>
          <p className='text-gray-500'>Created</p>
          <p className='text-gray-900'>
            {new Date(data.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export const DeleteModal = ({ show, onClose, onConfirm, productName }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      await onConfirm();
    } catch (error) {
      console.error('Delete failed:', error);
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  if (!show) return null;

  return (
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
          Are you sure you want to delete product "{productName}"? This action
          cannot be undone.
        </p>
        <div className='flex justify-end gap-4'>
          <button
            onClick={onClose}
            className='px-4 py-2 text-gray-600 border rounded hover:bg-gray-50'
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
  );
};

export const EditModal = ({ show, onClose, product, onSave }) => {
  const [formData, setFormData] = useState(product || {});
  const [imagePreview, setImagePreview] = useState(product?.main_image || null);

  if (!show) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should not exceed 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }

      setFormData((prev) => ({ ...prev, main_image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto'>
        <div className='flex justify-between items-center mb-4'>
          <h3 className='text-lg font-semibold'>Edit Product</h3>
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
              Product Image
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
                  id='product-image'
                />
                <label
                  htmlFor='product-image'
                  className='inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 cursor-pointer'
                >
                  Choose New Image
                </label>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
            {/* Basic Fields */}
            <FormField
              label='Product Code'
              value={formData.product_code}
              onChange={(value) =>
                setFormData({ ...formData, product_code: value })
              }
              required
            />
            <FormField
              label='Price'
              type='number'
              value={formData.price}
              onChange={(value) => setFormData({ ...formData, price: value })}
              required
            />
            <FormField
              label='Name (English)'
              value={formData.product_name__en}
              onChange={(value) =>
                setFormData({ ...formData, product_name__en: value })
              }
              required
            />
            <FormField
              label='Name (Vietnamese)'
              value={formData.product_name_vn}
              onChange={(value) =>
                setFormData({ ...formData, product_name_vn: value })
              }
            />
            <FormField
              label='Material (English)'
              value={formData.material}
              onChange={(value) =>
                setFormData({ ...formData, material: value })
              }
              required
            />
            <FormField
              label='Material (Vietnamese)'
              value={formData.material_vn}
              onChange={(value) =>
                setFormData({ ...formData, material_vn: value })
              }
            />
            <FormField
              label='Color (English)'
              value={formData.color}
              onChange={(value) => setFormData({ ...formData, color: value })}
              required
            />
            <FormField
              label='Color (Vietnamese)'
              value={formData.color_vn}
              onChange={(value) =>
                setFormData({ ...formData, color_vn: value })
              }
            />
            <FormField
              label='Warranty Period (months)'
              type='number'
              value={formData.warranty_period}
              onChange={(value) =>
                setFormData({ ...formData, warranty_period: value })
              }
              required
            />
            <div>
              <label className='block text-sm font-medium mb-1'>
                Visibility Status
              </label>
              <select
                value={formData.visibility_status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    visibility_status: e.target.value,
                  })
                }
                className='w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              >
                <option value='visible'>Visible</option>
                <option value='hidden'>Hidden</option>
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div className='flex justify-end gap-4 mt-6'>
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

const FormField = ({
  label,
  type = 'text',
  value,
  onChange,
  required = false,
}) => (
  <div>
    <label className='block text-sm font-medium mb-1'>{label}</label>
    <input
      type={type}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      className='w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
      required={required}
    />
  </div>
);
