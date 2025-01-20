import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const ProductSelect = ({ value, onChange, options, error }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selected = options.find((opt) => opt.value === value);

  const handleSelect = (option) => {
    onChange({ target: { value: option.value } });
    setIsOpen(false);
  };

  return (
    <div className='space-y-1 relative'>
      <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
        Chọn Sản Phẩm
      </label>

      {/* Selected Display */}
      <button
        type='button'
        onClick={() => setIsOpen(!isOpen)}
        className='w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
      >
        {selected ? (
          <div className='flex items-center gap-3'>
            {selected.imageUrl && (
              <img
                src={`${import.meta.env.VITE_BACKEND_URL}${selected.imageUrl}`}
                alt=''
                className='w-8 h-8 object-contain rounded-full'
                onError={(e) => (e.target.style.display = 'none')}
              />
            )}
            <span className='text-gray-900 dark:text-white'>
              {selected.label}
            </span>
          </div>
        ) : (
          <span className='text-gray-500'>Chọn sản phẩm</span>
        )}
        {isOpen ? (
          <ChevronUp className='w-5 h-5 text-gray-500' />
        ) : (
          <ChevronDown className='w-5 h-5 text-gray-500' />
        )}
      </button>

      {/* Dropdown Options */}
      {isOpen && (
        <div className='absolute z-50 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto'>
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => handleSelect(option)}
              className='flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600'
            >
              {option.imageUrl && (
                <img
                  src={`${import.meta.env.VITE_BACKEND_URL}${option.imageUrl}`}
                  alt=''
                  className='w-8 h-8 object-contain rounded-full'
                  onError={(e) => (e.target.style.display = 'none')}
                />
              )}
              <span className='text-gray-900 dark:text-white'>
                {option.label}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Error Message */}
      {error && <p className='text-sm text-red-600'>{error}</p>}
    </div>
  );
};

export default ProductSelect;
