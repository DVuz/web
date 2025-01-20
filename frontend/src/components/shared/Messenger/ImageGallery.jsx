import React from 'react';
import { FaTimes } from 'react-icons/fa';

const ImageGallery = ({ isExpanded, onClose }) => {
  const images = Array(20).fill(null);
  const displayImages = isExpanded ? images : images.slice(0, 6);

  return (
    <div
      className={`${isExpanded ? 'absolute top-0 left-0 right-0 bg-white p-4 shadow-lg rounded-lg z-10' : ''}`}
    >
      <div className='flex justify-between items-center'>
        <h4 className='font-semibold text-md p-2'>Images</h4>
        {isExpanded && (
          <FaTimes
            className='cursor-pointer hover:text-red-500'
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          />
        )}
      </div>
      <div
        className={`grid grid-cols-3 gap-4 p-2 ${isExpanded ? 'max-h-[500px] overflow-y-auto' : ''}`}
      >
        {displayImages.map((_, index) => (
          <div
            key={index}
            className={`${isExpanded ? 'w-24 h-24' : 'w-20 h-20'} 
              bg-gray-300 flex items-center justify-center rounded-lg transition-all duration-300`}
          >
            <span className='text-sm font-medium text-gray-500'>
              Image {index + 1}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
