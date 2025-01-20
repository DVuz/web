import React, { useState, useEffect } from 'react';
import { X, Upload, Plus, ChevronLeft, ChevronRight } from 'lucide-react';

const ProductImages = ({
  mainImage: propMainImage,
  subImages: propSubImages,
  onChange,
  error,
  resetImages, // Add new prop to handle reset
}) => {
  // Separate states for files and previews
  const [mainImageFile, setMainImageFile] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [subImageFiles, setSubImageFiles] = useState([]);
  const [subImagePreviews, setSubImagePreviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedPreview, setSelectedPreview] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const IMAGES_PER_ROW = 4;
  const MAX_SUB_IMAGES = 12;
  const totalPages = Math.ceil(subImagePreviews.length / IMAGES_PER_ROW);

  // Add effect to handle reset
  useEffect(() => {
    if (resetImages) {
      // Clear main image
      if (mainImagePreview) {
        URL.revokeObjectURL(mainImagePreview);
      }

      // Clear sub images
      subImagePreviews.forEach((preview) => {
        URL.revokeObjectURL(preview);
      });

      // Reset all states
      setMainImageFile(null);
      setMainImagePreview(null);
      setSubImageFiles([]);
      setSubImagePreviews([]);
      setCurrentPage(0);
      setSelectedPreview(null);
      setShowModal(false);

      // Clear file inputs
      const fileInputs = document.querySelectorAll('input[type="file"]');
      fileInputs.forEach((input) => {
        input.value = '';
      });
    }
  }, [resetImages]);

  useEffect(() => {
    if (propMainImage) {
      setMainImageFile(propMainImage);
      setMainImagePreview(URL.createObjectURL(propMainImage));
    }
    if (propSubImages?.length) {
      setSubImageFiles(propSubImages);
      setSubImagePreviews(
        propSubImages.map((file) => URL.createObjectURL(file))
      );
    }
  }, [propMainImage, propSubImages]);

  const handleImageUpload = async (file, isMain = false) => {
    try {
      const preview = URL.createObjectURL(file);

      if (isMain) {
        setMainImageFile(file);
        setMainImagePreview(preview);
        onChange?.({ mainImage: file, subImages: subImageFiles });
      } else {
        if (subImageFiles.length >= MAX_SUB_IMAGES) {
          alert(`Maximum ${MAX_SUB_IMAGES} sub-images allowed`);
          return;
        }
        const updatedFiles = [...subImageFiles, file];
        const updatedPreviews = [...subImagePreviews, preview];

        setSubImageFiles(updatedFiles);
        setSubImagePreviews(updatedPreviews);
        onChange?.({ mainImage: mainImageFile, subImages: updatedFiles });
      }
    } catch (error) {
      console.error('Error handling image:', error);
      alert('Failed to process image. Please try again.');
    }
  };

  const handleMainImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file, true);
    }
  };

  const handleSubImagesUpload = (e) => {
    const files = Array.from(e.target.files || []);
    const remainingSlots = MAX_SUB_IMAGES - subImageFiles.length;

    if (files.length > remainingSlots) {
      alert(
        `Only ${remainingSlots} more sub-image${remainingSlots === 1 ? '' : 's'} allowed`
      );
      files.slice(0, remainingSlots).forEach((file) => handleImageUpload(file));
    } else {
      files.forEach((file) => handleImageUpload(file));
    }
  };

  const removeSubImage = (index) => {
    const actualIndex = currentPage * IMAGES_PER_ROW + index;
    const newFiles = subImageFiles.filter((_, i) => i !== actualIndex);
    const newPreviews = subImagePreviews.filter((_, i) => i !== actualIndex);

    setSubImageFiles(newFiles);
    setSubImagePreviews(newPreviews);
    onChange?.({ mainImage: mainImageFile, subImages: newFiles });

    const newTotalPages = Math.ceil(newPreviews.length / IMAGES_PER_ROW);
    if (currentPage >= newTotalPages) {
      setCurrentPage(Math.max(0, newTotalPages - 1));
    }
  };

  const clearMainImage = () => {
    setMainImageFile(null);
    setMainImagePreview(null);
    onChange?.({ mainImage: null, subImages: subImageFiles });
  };

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((curr) => curr + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage((curr) => curr - 1);
    }
  };

  const openImageModal = (preview) => {
    setSelectedPreview(preview);
    setShowModal(true);
  };

  const closeImageModal = () => {
    setShowModal(false);
    setSelectedPreview(null);
  };

  const currentPreviews = subImagePreviews.slice(
    currentPage * IMAGES_PER_ROW,
    (currentPage + 1) * IMAGES_PER_ROW
  );

  return (
    <div className='space-y-4'>
      <h2 className='text-lg font-semibold text-gray-700 border-b pb-2'>
        Product Images
      </h2>

      {/* Main Image */}
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          Main Image
        </label>
        <div className='relative'>
          {mainImagePreview ? (
            <div className='relative w-full h-96'>
              <img
                src={mainImagePreview}
                alt='Main product'
                className='w-full h-full object-cover rounded-lg cursor-pointer'
                onClick={() => openImageModal(mainImagePreview)}
              />
              <button
                onClick={clearMainImage}
                className='absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600'
                aria-label='Remove main image'
              >
                <X className='w-4 h-4' />
              </button>
            </div>
          ) : (
            <label className='w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500'>
              <Upload className='w-6 h-6 text-gray-400' />
              <span className='mt-2 text-sm text-gray-500'>
                Upload Main Image
              </span>
              <input
                type='file'
                className='hidden'
                onChange={handleMainImageUpload}
                accept='image/*'
              />
            </label>
          )}
        </div>
      </div>

      {/* Sub Images */}
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          Additional Images ({subImageFiles.length}/{MAX_SUB_IMAGES})
        </label>
        <div className='relative'>
          <div className='flex items-center space-x-4 px-8'>
            {/* Navigation Buttons */}
            {totalPages > 1 && (
              <>
                <button
                  onClick={prevPage}
                  disabled={currentPage === 0}
                  className={`absolute left-0 z-10 p-2 bg-white rounded-full shadow-lg transform -translate-y-1/2 top-1/2 
                    ${currentPage === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                  aria-label='Previous page'
                >
                  <ChevronLeft className='w-5 h-5' />
                </button>
                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages - 1}
                  className={`absolute right-0 z-10 p-2 bg-white rounded-full shadow-lg transform -translate-y-1/2 top-1/2
                    ${currentPage === totalPages - 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                  aria-label='Next page'
                >
                  <ChevronRight className='w-5 h-5' />
                </button>
              </>
            )}

            {/* Image Gallery */}
            <div className='grid grid-cols-4 gap-4 w-full'>
              {currentPreviews.map((preview, index) => (
                <div key={index} className='relative w-32 h-32'>
                  <img
                    src={preview}
                    alt={`Product ${currentPage * IMAGES_PER_ROW + index + 1}`}
                    className='w-full h-full object-cover rounded-lg cursor-pointer'
                    onClick={() => openImageModal(preview)}
                  />
                  <button
                    onClick={() => removeSubImage(index)}
                    className='absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600'
                    aria-label='Remove image'
                  >
                    <X className='w-4 h-4' />
                  </button>
                </div>
              ))}

              {/* Add More Button */}
              {subImageFiles.length < MAX_SUB_IMAGES && (
                <label className='w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500'>
                  <Plus className='w-6 h-6 text-gray-400' />
                  <span className='mt-2 text-sm text-gray-500'>Add More</span>
                  <input
                    type='file'
                    className='hidden'
                    onChange={handleSubImagesUpload}
                    accept='image/*'
                    multiple
                  />
                </label>
              )}
            </div>
          </div>

          {/* Page Indicators */}
          {totalPages > 1 && (
            <div className='flex justify-center mt-4 space-x-2'>
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index)}
                  className={`w-2 h-2 rounded-full ${
                    currentPage === index ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                  aria-label={`Go to page ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Image Modal */}
      {showModal && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75'
          style={{ top: -24, left: 0, right: 0, bottom: 0 }}
        >
          <div className='relative w-[800px] h-[600px] bg-white rounded-lg p-4'>
            <button
              onClick={closeImageModal}
              className='absolute -top-2 -right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 z-10'
              aria-label='Close modal'
            >
              <X className='w-6 h-6' />
            </button>
            <div className='w-full h-full flex items-center justify-center'>
              <img
                src={selectedPreview}
                alt='Selected product'
                className='max-w-full max-h-full object-contain'
              />
            </div>
          </div>
        </div>
      )}

      {error && <p className='mt-2 text-sm text-red-600'>{error}</p>}
    </div>
  );
};

export default ProductImages;
