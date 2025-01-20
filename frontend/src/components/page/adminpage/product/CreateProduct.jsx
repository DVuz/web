import React, { useState, useEffect, useCallback } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ProductPricing from '../productprice/ProductPricing';
import MultiSelect from '../../../common/MultiSelect';
import Input from '../../../common/Input';
import ProductImages from './ProductImages';
import ProductDescriptionEditor from './ProductDescriptionEditor';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { getAllProductTypes } from '../../../../services/getApi';
import FormSelect from '../../../common/FormSelect';
import api from '../../../../services/api';
import Toast from '../../../common/ToastDemo';
import { numberToVietnameseWords } from '../../../../utils/numberToVietnameseWords';

const CreateProduct = () => {
  const [productTypes, setProductTypes] = useState([]);
  const [apiError, setApiError] = useState(null);

  // Unified form state
  const initialFormState = {
    basic: {
      product_code: '',
      product_name_vn: '',
      product_name_en: '',
      warranty_period: '',
      visibility_status: 'visible',
    },
    images: {
      mainImage: null,
      subImages: [],
    },
    dimensions: {
      length: '',
      width: '',
      height: '',
    },
    details: {
      material: '',
      material_vn: '',
      color: '',
      color_vn: '',
      origin: '',
      origin_vn: '',
    },
    descriptions: {
      description_en: '',
      description_vn: '',
      detailDescriptionSections: [
        {
          id: 1,
          titleVi: '',
          titleEn: '',
          contentVi: '',
          contentEn: '',
          images: [],
        },
      ],
    },
    categories: {
      productType: null,
    },
    pricing: {
      price: '',
    },
  };

  const [formState, setFormState] = useState(initialFormState);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({
    loading: false,
    message: '',
    type: '', // 'success' or 'error'
  });

  // Visibility status options
  const visibilityOptions = [
    { value: 'visible', label: 'Visible' },
    { value: 'hidden', label: 'Hidden' },
  ];
  const [resetImagesFlag, setResetImagesFlag] = useState(false);
  const [resetEditorFlag, setResetEditorFlag] = useState(false);
  const [priceInWords, setPriceInWords] = useState('');

  useEffect(() => {
    const fetchProductTypes = async () => {
      try {
        const response = await getAllProductTypes();
        const formattedProductTypes = response.productTypes.map((pt) => ({
          value: String(pt.product_type_id),
          label: `${pt.productType_name_en} / ${pt.productType_name_vn}`,
        }));
        setProductTypes(formattedProductTypes);
      } catch (error) {
        console.error('Error fetching product types:', error);
        setApiError('Failed to load product types');
      }
    };
    fetchProductTypes();
  }, []);

  const resetForm = () => {
    // Reset main form state
    setFormState(initialFormState);

    // Reset errors
    setErrors({});

    // Reset submission status
    setSubmitStatus({
      loading: false,
      message: '',
      type: '',
    });

    // Reset API error
    setApiError(null);

    // Reset ReactQuill editors
    const quillElements = document.querySelectorAll('.ql-editor');
    quillElements.forEach((editor) => {
      editor.innerHTML = '';
    });

    // Reset file inputs
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach((input) => {
      input.value = '';
    });

    // Force cleanup of image previews
    if (formState.images.mainImage) {
      URL.revokeObjectURL(URL.createObjectURL(formState.images.mainImage));
    }

    if (formState.images.subImages?.length) {
      formState.images.subImages.forEach((image) => {
        if (image instanceof File) {
          URL.revokeObjectURL(URL.createObjectURL(image));
        }
      });
    }

    // Clean up detail description section images
    formState.descriptions.detailDescriptionSections.forEach((section) => {
      if (section.images?.length) {
        section.images.forEach((image) => {
          if (image instanceof File) {
            URL.revokeObjectURL(URL.createObjectURL(image));
          }
        });
      }
    });
  };

  const handleProductTypeChange = useCallback((selected) => {
    setFormState((prev) => ({
      ...prev,
      categories: {
        ...prev.categories,
        productType: selected,
      },
    }));
    console.log('2:', selected);
  }, []);

  const handleVisibilityChange = useCallback((selected) => {
    setFormState((prev) => ({
      ...prev,
      basic: {
        ...prev.basic,
        visibility_status: selected,
      },
    }));
    console.log('1ádadadsadsadadsasd', selected);
  }, []);

  const handleInputChange = (section) => (field) => (value) => {
    setFormState((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));

    if (errors[`${section}.${field}`]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[`${section}.${field}`];
        return newErrors;
      });
    }
  };

  const handleImagesChange = (images) => {
    setFormState((prev) => ({
      ...prev,
      images: images,
    }));
  };

  const handleDescriptionChange = (field) => (value) => {
    setFormState((prev) => ({
      ...prev,
      descriptions: {
        ...prev.descriptions,
        [field]: value,
      },
    }));
  };

  const handleDetailDescriptionChange = useCallback((newSections) => {
    const processedSections = newSections.map((section) => ({
      id: section.id,
      titleEn: section.titleEn,
      titleVi: section.titleVi,
      contentEn: section.contentEn,
      contentVi: section.contentVi,
      images: section.images.map((img) => ({
        url: img.url,
        description: img.description || '',
      })),
    }));

    setFormState((prev) => ({
      ...prev,
      descriptions: {
        ...prev.descriptions,
        detailDescriptionSections: processedSections,
      },
    }));
  }, []);

  const handlePriceChange = (value) => {
    setFormState((prev) => ({
      ...prev,
      pricing: {
        price: value,
      },
    }));
    if (value && !isNaN(value)) {
      const words = numberToVietnameseWords(parseInt(value));
      setPriceInWords(words);
    } else {
      setPriceInWords('');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Basic Information validation
    if (!formState.basic.product_code?.trim()) {
      newErrors.basic = {
        ...newErrors.basic,
        product_code: 'Product code is required',
      };
    }
    if (!formState.basic.product_name_vn?.trim()) {
      newErrors.basic = {
        ...newErrors.basic,
        product_name_vn: 'Vietnamese product name is required',
      };
    }
    if (!formState.basic.product_name_en?.trim()) {
      newErrors.basic = {
        ...newErrors.basic,
        product_name_en: 'English product name is required',
      };
    }
    if (!formState.basic.warranty_period?.trim()) {
      newErrors.basic = {
        ...newErrors.basic,
        warranty_period: 'Warranty period is required',
      };
    }
    if (!formState.basic.visibility_status) {
      newErrors.basic = {
        ...newErrors.basic,
        visibility_status: 'Visibility status is required',
      };
    }

    // Image validation
    if (!formState.images.mainImage) {
      newErrors.images = {
        mainImage: 'Main product image is required',
      };
    }

    // Dimensions validation
    const dimensions = formState.dimensions;
    if (!dimensions.length || dimensions.length.trim() === '') {
      newErrors.dimensions = {
        ...newErrors.dimensions,
        length: 'Length is required',
      };
    }
    if (!dimensions.width || dimensions.width.trim() === '') {
      newErrors.dimensions = {
        ...newErrors.dimensions,
        width: 'Width is required',
      };
    }
    if (!dimensions.height || dimensions.height.trim() === '') {
      newErrors.dimensions = {
        ...newErrors.dimensions,
        height: 'Height is required',
      };
    }

    // Details validation
    const details = formState.details;
    if (!details.material || details.material.trim() === '') {
      newErrors.details = {
        ...newErrors.details,
        material: 'Material is required',
      };
    }
    if (!details.color || details.color.trim() === '') {
      newErrors.details = {
        ...newErrors.details,
        color: 'Color is required',
      };
    }
    if (!details.origin || details.origin.trim() === '') {
      newErrors.details = {
        ...newErrors.details,
        origin: 'Origin is required',
      };
    }

    // Descriptions validation
    if (!formState.descriptions.description_en?.trim()) {
      newErrors.descriptions = {
        ...newErrors.descriptions,
        description_en: 'English description is required',
      };
    }
    if (!formState.descriptions.description_vn?.trim()) {
      newErrors.descriptions = {
        ...newErrors.descriptions,
        description_vn: 'Vietnamese description is required',
      };
    }

    // Categories validation
    if (!formState.categories.productType) {
      newErrors.categories = {
        ...newErrors.categories,
        productType: 'Product type is required',
      };
    }

    // Pricing validation
    if (!formState.pricing?.price || formState.pricing.price === '') {
      newErrors.pricing = 'Price is required';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      const firstErrorElement = document.querySelector(
        '.error-message, .quill-error'
      );
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    console.log('Submitting form...');
    console.log('Form state:', formState);
    console.log('Errors:', errors);
    if (!validateForm()) return;
    setIsSubmitting(true);
    setSubmitStatus({
      loading: true,
      message: 'Creating product...',
      type: '',
    });
    setApiError(null);

    try {
      const formData = new FormData();

      // Add basic info
      Object.entries(formState.basic).forEach(([key, value]) => {
        formData.append(key, String(value)); // Chuyển đổi value thành string
      });

      // Add images
      if (formState.images.mainImage instanceof File) {
        formData.append('mainImage', formState.images.mainImage);
      }

      if (formState.images.subImages?.length > 0) {
        formState.images.subImages.forEach((image) => {
          if (image instanceof File) {
            formData.append('subImages', image);
          }
        });
      }

      // Add dimensions - chuyển đổi sang string
      Object.entries(formState.dimensions).forEach(([key, value]) => {
        formData.append(key, String(value));
      });

      // Add details
      Object.entries(formState.details).forEach(([key, value]) => {
        formData.append(key, String(value));
      });

      // Add descriptions
      formData.append(
        'description_en',
        String(formState.descriptions.description_en || '')
      );
      formData.append(
        'description_vn',
        String(formState.descriptions.description_vn || '')
      );

      // Xử lý detailDescriptionSections
      const sectionsForFormData =
        formState.descriptions.detailDescriptionSections.map((section) => ({
          id: section.id,
          titleEn: section.titleEn,
          titleVi: section.titleVi,
          contentEn: section.contentEn,
          contentVi: section.contentVi,
          images: Array.isArray(section.images)
            ? section.images.map((image) => image.url) // Lấy danh sách Base64
            : [], // Nếu không có ảnh, trả về mảng rỗng
          // Bỏ qua images trong JSON, sẽ xử lý riêng
        }));
      console.log(sectionsForFormData, sectionsForFormData);

      formData.append(
        'detailDescriptionSections',
        JSON.stringify(sectionsForFormData)
      );
      console.log(
        'section image',
        formState.descriptions.detailDescriptionSections
      );

      //       const detailDescriptionSections = formState.descriptions.detailDescriptionSections;

      // if (Array.isArray(detailDescriptionSections)) {
      //   detailDescriptionSections.forEach((section, index) => {
      //     console.log(`Section ${index + 1}:`);

      //     // Kiểm tra và lấy ra danh sách ảnh
      //     if (Array.isArray(section.images) && section.images.length > 0) {
      //       section.images.forEach((image, imgIndex) => {
      //         console.log(`  Image ${imgIndex + 1}:`);
      //         console.log(`  - URL: ${image.url}`);
      //         console.log(`  - Description: ${image.description}`);
      //       });
      //     } else {
      //       console.log(`  No images available`);
      //     }
      //   });
      // } else {
      //   console.log('No detail description sections available');
      // }

      // Xử lý images trong sections riêng
      formState.descriptions.detailDescriptionSections.forEach(
        (section, sectionIndex) => {
          if (section.images?.length > 0) {
            section.images.forEach((image, imageIndex) => {
              if (image instanceof File) {
                formData.append(
                  `sectionImages`,
                  image,
                  `section_${sectionIndex}_image_${imageIndex}`
                );
              }
            });
          }
        }
      );
      console.log('2:', formState.categories.productType);
      // Add product type
      if (formState.categories.productType) {
        formData.append(
          'productType',
          String(formState.categories.productType)
        );
      }

      // Add pricing
      if (formState.pricing?.price) {
        formData.append('price', String(formState.pricing.price));
      }

      // Log FormData content for debugging
      // for (let pair of formData.entries()) {
      //   console.log(pair[0], pair[1]);
      // }
      console.log('formState', formState);
      const response = await fetch('https://192.168.0.102:3000/api/products', {
        method: 'POST',
        body: formData,
        // Không set Content-Type header khi dùng FormData
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to create product');
      }

      // Xử lý thành công
      console.log('Product created successfully:', responseData);
      // Thêm xử lý thành công ở đây (redirect, thông báo, etc.)

      resetForm();

      setSubmitStatus({
        loading: false,
        message: 'Product created successfully!',
        type: 'success',
      });
      setFormState(initialFormState);
      setResetEditorFlag(true);
      setResetImagesFlag(true);
      setShowToast(true);
      setTimeout(() => {
        setResetImagesFlag(false);
        setResetEditorFlag(false);
      }, 100);
    } catch (error) {
      console.error('Error creating product:', error);
      setApiError(error.message);
      setSubmitStatus({
        loading: false,
        message: error.message || 'Failed to create product',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setResetEditorFlag(true);
    setResetImagesFlag(true);
    // Reset form to initial state
    resetForm();

    setFormState(initialFormState);
    // Clear any errors
    setErrors({});
    // Reset submission status
    setSubmitStatus({
      loading: false,
      message: 'Cancelled',
      type: '',
    });
    // Reset API error
    setApiError(null);

    setTimeout(() => {
      setResetImagesFlag(false);
      setResetEditorFlag(false);
    }, 100);
    // Optionally show confirmation toast
    setShowToast(true);
    Toast.message = 'Form has been reset';
    Toast.type = 'info';
    console.log('Form reset successful');
  };

  return (
    <div className='flex-1 p-8 bg-gray-50 overflow-y-auto h-full'>
      <div className='mx-auto'>
        <h1 className='text-2xl font-bold text-gray-800 mb-6'>
          Create New Product
        </h1>

        {apiError && (
          <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700'>
            <AlertCircle className='w-5 h-5' />
            <span>{apiError}</span>
          </div>
        )}

        <div className='grid grid-cols-[2fr,1fr] gap-8'>
          {/* Left Column */}
          <div className='space-y-6'>
            {/* Basic Information */}
            <div className='bg-white rounded-lg shadow p-6'>
              <h2 className='text-lg font-semibold text-gray-700 border-b pb-2'>
                Basic Information
              </h2>
              <div className='grid grid-cols-2 gap-6 mt-4'>
                <Input
                  labelText='Product Code'
                  typeInput='text'
                  value={formState.basic.product_code}
                  inputValue={handleInputChange('basic')('product_code')}
                  placeholder='Enter product code'
                  error={errors.basic?.product_code}
                />
                <Input
                  labelText='Warranty Period'
                  typeInput='number'
                  value={formState.basic.warranty_period}
                  inputValue={handleInputChange('basic')('warranty_period')}
                  placeholder='Enter warranty period'
                  error={errors.basic?.warranty_period}
                />
              </div>
              <div className='grid grid-cols-2 gap-6 mt-4'>
                <Input
                  labelText='Product Name (VN)'
                  typeInput='text'
                  value={formState.basic.product_name_vn}
                  inputValue={handleInputChange('basic')('product_name_vn')}
                  placeholder='Enter product name in Vietnamese'
                  error={errors.basic?.product_name_vn}
                />
                <Input
                  labelText='Product Name (EN)'
                  typeInput='text'
                  value={formState.basic.product_name_en}
                  inputValue={handleInputChange('basic')('product_name_en')}
                  placeholder='Enter product name in English'
                  error={errors.basic?.product_name_en}
                />
              </div>
              <div className='mt-4'>
                <FormSelect
                  labelText='Visibility Status'
                  options={visibilityOptions}
                  setlectValue={handleVisibilityChange}
                  error={errors.basic?.visibility_status}
                />
              </div>
            </div>

            {/* Product Details */}
            <div className='bg-white rounded-lg shadow p-6'>
              <h2 className='text-lg font-semibold text-gray-700 border-b pb-2 mb-4'>
                Product Details
              </h2>
              <div className='grid grid-cols-3 gap-6'>
                {/* Dimensions */}
                {Object.entries(formState.dimensions).map(([key, value]) => (
                  <Input
                    key={key}
                    labelText={`${key.charAt(0).toUpperCase() + key.slice(1)} (cm)`}
                    typeInput='number'
                    value={value}
                    inputValue={handleInputChange('dimensions')(key)}
                    placeholder={`Enter ${key}`}
                    error={errors.dimensions?.[key]}
                  />
                ))}
              </div>

              <div className='grid grid-cols-2 gap-6 mt-6'>
                {/* Details */}
                {Object.entries({
                  material: 'Material',
                  color: 'Color',
                  origin: 'Origin',
                }).map(([key, label]) => (
                  <React.Fragment key={key}>
                    <Input
                      labelText={`${label} (EN)`}
                      typeInput='text'
                      value={formState.details[key]}
                      inputValue={handleInputChange('details')(key)}
                      placeholder={`Enter ${label.toLowerCase()} in English`}
                      error={errors.details?.[key]}
                    />
                    <Input
                      labelText={`${label} (VN)`}
                      typeInput='text'
                      value={formState.details[`${key}_vn`]}
                      inputValue={handleInputChange('details')(`${key}_vn`)}
                      placeholder={`Enter ${label.toLowerCase()} in Vietnamese`}
                      error={errors.details?.[`${key}_vn`]}
                    />
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Images */}
            <div className='bg-white rounded-lg shadow p-6'>
              <ProductImages
                mainImage={formState.images.mainImage}
                subImages={formState.images.subImages}
                onChange={handleImagesChange}
                error={errors.images?.mainImage}
                resetImages={resetImagesFlag} // Reset images flag
              />
            </div>

            {/* Descriptions */}
            <div className='bg-white rounded-lg shadow p-6 space-y-6'>
              {/* Basic Description */}
              <div className='flex flex-col h-[300px]'>
                <h2 className='text-lg font-semibold text-gray-700 border-b pb-2 mb-4'>
                  Description <span className='text-red-500'>*</span>
                </h2>
                <div className='flex-1'>
                  <ReactQuill
                    theme='snow'
                    value={formState.descriptions.description_en}
                    onChange={handleDescriptionChange('description_en')}
                    className={`h-full ${errors.descriptions?.description_en ? 'quill-error' : ''}`}
                  />
                  {errors.descriptions?.description && (
                    <p className='text-sm text-red-600 mt-2'>
                      {errors.descriptions.description}
                    </p>
                  )}
                </div>
              </div>

              <div className='flex flex-col h-[300px]'>
                <h2 className='text-lg font-semibold text-gray-700 border-b pb-2 mb-4'>
                  Description (VN) <span className='text-red-500'>*</span>
                </h2>
                <div className='flex-1'>
                  <ReactQuill
                    theme='snow'
                    value={formState.descriptions.description_vn}
                    onChange={handleDescriptionChange('description_vn')}
                    className={`h-full ${errors.descriptions?.description_vn ? 'quill-error' : ''}`}
                  />
                </div>
              </div>

              {/* Detailed Description */}
              <div>
                <h2 className='text-lg font-semibold text-gray-700 border-b pb-2 mb-4'>
                  Detailed Description <span className='text-red-500'>*</span>
                </h2>
                {errors.descriptions?.detailDescriptionSections && (
                  <p className='text-sm text-red-600 mb-4'>
                    {errors.descriptions.detailDescriptionSections}
                  </p>
                )}
                <ProductDescriptionEditor
                  sections={formState.descriptions.detailDescriptionSections}
                  onChange={handleDetailDescriptionChange}
                  resetEditor={resetEditorFlag} // Add this prop
                />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className='space-y-6'>
            {/* Pricing */}
            <div className='bg-white rounded-lg shadow p-6'>
              <h2 className='text-lg font-semibold text-gray-700 border-b pb-2 mb-4'>
                Pricing
              </h2>
              <Input
                labelText='Price'
                typeInput='number'
                value={formState.pricing?.price || ''}
                inputValue={(value) => handlePriceChange(value)}
                placeholder='Enter price'
                error={errors.pricing}
              />
              {priceInWords && (
                <p className='mt-2 text-sm text-red-600 italic'>
                  {priceInWords}
                </p>
              )}
            </div>

            {/* Categories */}
            <div className='bg-white rounded-lg shadow p-6 space-y-4'>
              <FormSelect
                labelText='Product Type'
                options={productTypes}
                value={formState.categories.productType}
                setlectValue={handleProductTypeChange}
                error={errors.categories?.productType}
              />
            </div>

            {/* Action Buttons */}
            <div className='flex justify-end space-x-4 pt-6'>
              <button
                onClick={handleCancel}
                className='px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50'
                disabled={submitStatus.loading}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className='px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2'
                disabled={submitStatus.loading}
              >
                {submitStatus.loading ? (
                  <>
                    <Loader2 className='w-4 h-4 animate-spin' />
                    Creating...
                  </>
                ) : (
                  'Create Product'
                )}
              </button>
            </div>

            {/* Submit Error */}
            {/* {errors.submit && (
              <p className='text-sm text-red-600 mt-2'>{errors.submit}</p>
            )} */}

            {/* Status Messages */}
            {submitStatus.message && submitStatus.message !== 'Cancelled' && (
              <div
                className={`mt-4 p-4 rounded-lg flex items-center gap-2 ${
                  submitStatus.type === 'success'
                    ? 'bg-green-50 text-green-700'
                    : submitStatus.type === 'error'
                      ? 'bg-red-50 text-red-700'
                      : 'bg-blue-50 text-blue-700'
                }`}
              >
                {submitStatus.type === 'success' ? (
                  <CheckCircle2 className='w-5 h-5' />
                ) : submitStatus.type === 'error' ? (
                  <AlertCircle className='w-5 h-5' />
                ) : (
                  <Loader2 className='w-5 h-5 animate-spin' />
                )}
                <span>{submitStatus.message}</span>
              </div>
            )}

            {showToast && (
              <Toast
                message={submitStatus.message}
                type='success'
                duration={3000}
                onClose={() => setShowToast(false)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProduct;
