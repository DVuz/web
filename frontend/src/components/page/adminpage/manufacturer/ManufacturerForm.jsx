import { useState, useRef } from 'react';
import Input from '../../../common/Input';
import { Upload } from 'lucide-react';
import { uploadManufacturer } from '../../../../services/uploadService';

export default function ManufacturerForm() {
  const fileInputRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const [formData, setFormData] = useState({
    manufacturerName: '',
    contactInfo: '',
    address: '',
    phoneNumber: '',
    email: '',
    image: null,
    imagePreview: null,
    status: 'active',
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.manufacturerName) {
      newErrors.manufacturerName = 'Manufacturer name is required';
    }

    if (!formData.contactInfo) {
      newErrors.contactInfo = 'Contact information is required';
    }

    if (!formData.address) {
      newErrors.address = 'Address is required';
    }

    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\+?[\d-]+$/.test(formData.phoneNumber)) {
      console.log(formData.phoneNumber);
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.image) {
      newErrors.image = 'Logo image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          image: 'File size should not exceed 5MB',
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

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          image: file,
          imagePreview: reader.result,
        }));
        setErrors((prev) => ({ ...prev, image: '' }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const file = event.dataTransfer.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const fakeEvent = { target: { files: [file] } };
        handleImageChange(fakeEvent);
      } else {
        setErrors((prev) => ({
          ...prev,
          image: 'Please upload an image file',
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setShowPreview(true);
  };

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('manufacturer_name', formData.manufacturerName);
      formDataToSend.append('contact_info', formData.contactInfo);
      formDataToSend.append('address', formData.address);
      formDataToSend.append('phone_number', formData.phoneNumber);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('status', formData.status);
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      console.log('Form submitted:', formDataToSend);
      // Here you would make your API call
      const response = await uploadManufacturer(formDataToSend);
      console.log('Category upload success:', response);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Reset form after successful submission
      setFormData({
        manufacturerName: '',
        contactInfo: '',
        address: '',
        phoneNumber: '',
        email: '',
        image: null,
        imagePreview: null,
        status: 'active',
      });
      setShowPreview(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showPreview) {
    return (
      <PreviewForm
        formData={formData}
        onBack={() => setShowPreview(false)}
        onConfirm={handleConfirmSubmit}
        isSubmitting={isSubmitting}
      />
    );
  }

  return (
    <div className='flex-1 p-8 bg-gray-50 dark:bg-gray-900 overflow-y-auto h-full'>
      <div className='max-w-4xl mx-auto'>
        {/* Header Section */}
        <div className='mb-6'>
          <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
            Create New Manufacturer
          </h1>
          <p className='mt-1 text-sm text-gray-600 dark:text-gray-400'>
            Add a new manufacturer to your system by filling out the information
            below.
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
                    labelText='Manufacturer Name'
                    typeInput='text'
                    placeholder='e.g., Tech Innovators Inc.'
                    inputValue={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        manufacturerName: value,
                      }))
                    }
                    value={formData.manufacturerName}
                    error={errors.manufacturerName}
                  />

                  <Input
                    labelText='Email Address'
                    typeInput='email'
                    placeholder='e.g., contact@company.com'
                    inputValue={(value) =>
                      setFormData((prev) => ({ ...prev, email: value }))
                    }
                    value={formData.email}
                    error={errors.email}
                  />
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
                      setFormData((prev) => ({ ...prev, phoneNumber: value }))
                    }
                    value={formData.phoneNumber}
                    error={errors.phoneNumber}
                  />

                  <Input
                    labelText='Contact Information'
                    typeInput='textarea'
                    placeholder='Additional contact details...'
                    inputValue={(value) =>
                      setFormData((prev) => ({ ...prev, contactInfo: value }))
                    }
                    value={formData.contactInfo}
                    error={errors.contactInfo}
                  />
                </div>
              </div>
              {/* Address & Logo Section */}
              <div>
                <h2 className='text-lg font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700'>
                  Location & Branding
                </h2>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div className='md:col-span-2'>
                    <Input
                      labelText='Business Address'
                      typeInput='textarea'
                      placeholder='Full address including street, city, state, and zip code'
                      inputValue={(value) =>
                        setFormData((prev) => ({ ...prev, address: value }))
                      }
                      value={formData.address}
                      error={errors.address}
                    />
                  </div>

                  <div className='md:col-span-2'>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                      Logo Image
                    </label>
                    <div
                      className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg ${
                        errors.image
                          ? 'border-red-300 dark:border-red-600'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                    >
                      <div className='space-y-2 text-center'>
                        {formData.imagePreview ? (
                          <div className='relative group'>
                            <img
                              src={formData.imagePreview}
                              alt='Logo preview'
                              className='mx-auto h-32 w-32 object-contain rounded-lg'
                            />
                            <div
                              className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity'
                              onClick={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  image: null,
                                  imagePreview: null,
                                }));
                                if (fileInputRef.current) {
                                  fileInputRef.current.value = '';
                                }
                              }}
                            >
                              <span className='text-white cursor-pointer'>
                                Remove
                              </span>
                            </div>
                          </div>
                        ) : (
                          <>
                            <Upload className='mx-auto h-12 w-12 text-gray-400' />
                            <div className='flex text-sm text-gray-600 dark:text-gray-400'>
                              <label
                                htmlFor='file-upload'
                                className='relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500'
                              >
                                <span>Upload a file</span>
                                <input
                                  id='file-upload'
                                  ref={fileInputRef}
                                  type='file'
                                  className='sr-only'
                                  accept='image/*'
                                  onChange={handleImageChange}
                                />
                              </label>
                              <p className='pl-1'>or drag and drop</p>
                            </div>
                            <p className='text-xs text-gray-500 dark:text-gray-400'>
                              PNG, JPG, GIF up to 5MB
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                    {errors.image && (
                      <p className='mt-1 text-xs text-red-600 dark:text-red-400'>
                        <span className='italic font-medium'>
                          {errors.image}
                        </span>
                      </p>
                    )}
                  </div>

                  <div className='space-y-2'>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                      Status
                    </label>
                    <select
                      className='w-full p-2.5 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white'
                      value={formData.status}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          status: e.target.value,
                        }))
                      }
                    >
                      <option value='active'>Active</option>
                      <option value='inactive'>Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className='flex justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700'>
                <button
                  type='button'
                  className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600'
                  onClick={() => {
                    setFormData({
                      manufacturerName: '',
                      contactInfo: '',
                      address: '',
                      phoneNumber: '',
                      email: '',
                      image: null,
                      imagePreview: null,
                      status: 'active',
                    });
                    setErrors({});
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                >
                  Reset Form
                </button>

                <button
                  type='submit'
                  className='px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                >
                  Preview
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

// Preview Component
function PreviewForm({ formData, onBack, onConfirm, isSubmitting }) {
  return (
    <div className='flex-1 p-8 bg-gray-50 dark:bg-gray-900 overflow-y-auto h-full'>
      <div className='max-w-4xl mx-auto'>
        <div className='mb-6 flex justify-between items-center'>
          <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
            Preview Manufacturer Information
          </h1>
          <button
            onClick={onBack}
            className='text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400'
          >
            ← Back to Edit
          </button>
        </div>

        <div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {/* Logo Preview Column */}
            <div className='md:col-span-1 flex flex-col items-center'>
              <p className='text-gray-500 dark:text-gray-400 mb-2'>Logo</p>
              {formData.imagePreview ? (
                <img
                  src={formData.imagePreview}
                  alt='Logo preview'
                  className='w-full max-w-[200px] h-auto object-contain rounded-lg border border-gray-200 dark:border-gray-700'
                />
              ) : (
                <div className='w-full max-w-[200px] h-[200px] bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center'>
                  <span className='text-gray-400'>No image</span>
                </div>
              )}
            </div>

            {/* Details Columns */}
            <div className='md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4'>
              {/* Basic Information */}
              <div className='space-y-4'>
                <h4 className='font-medium text-gray-900 dark:text-white border-b pb-2'>
                  Basic Information
                </h4>

                <div>
                  <p className='text-sm text-gray-500 dark:text-gray-400'>
                    Manufacturer Name
                  </p>
                  <p className='font-medium text-gray-900 dark:text-white'>
                    {formData.manufacturerName}
                  </p>
                </div>

                <div>
                  <p className='text-sm text-gray-500 dark:text-gray-400'>
                    Status
                  </p>
                  <p className='font-medium text-gray-900 dark:text-white capitalize'>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        formData.status === 'active'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                      }`}
                    >
                      {formData.status}
                    </span>
                  </p>
                </div>
              </div>

              {/* Contact Information */}
              <div className='space-y-4'>
                <h4 className='font-medium text-gray-900 dark:text-white border-b pb-2'>
                  Contact Information
                </h4>

                <div>
                  <p className='text-sm text-gray-500 dark:text-gray-400'>
                    Email
                  </p>
                  <p className='font-medium text-gray-900 dark:text-white'>
                    {formData.email}
                  </p>
                </div>

                <div>
                  <p className='text-sm text-gray-500 dark:text-gray-400'>
                    Phone Number
                  </p>
                  <p className='font-medium text-gray-900 dark:text-white'>
                    {formData.phoneNumber}
                  </p>
                </div>
              </div>

              {/* Additional Information */}
              <div className='md:col-span-2 space-y-4'>
                <h4 className='font-medium text-gray-900 dark:text-white border-b pb-2'>
                  Additional Information
                </h4>

                <div>
                  <p className='text-sm text-gray-500 dark:text-gray-400'>
                    Contact Information
                  </p>
                  <p className='font-medium text-gray-900 dark:text-white whitespace-pre-wrap'>
                    {formData.contactInfo}
                  </p>
                </div>

                <div>
                  <p className='text-sm text-gray-500 dark:text-gray-400'>
                    Address
                  </p>
                  <p className='font-medium text-gray-900 dark:text-white whitespace-pre-wrap'>
                    {formData.address}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Confirmation Section */}
          <div className='mt-6 pt-4 border-t border-gray-200 dark:border-gray-700'>
            <div className='flex items-center justify-between'>
              <p className='text-sm text-gray-500 dark:text-gray-400'>
                Please review the information above before creating the
                manufacturer.
              </p>
              <button
                onClick={onConfirm}
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
                  <span>Confirm & Create</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
