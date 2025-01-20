import React, { useState } from 'react';
import { Eye, EyeOff, Search } from 'lucide-react';

const CustomInput = ({
  label,
  type,
  placeholder,
  value,
  onChange,
  error,
  isSearchable,
  searchResults,
  onSearchSelect,
  disabled,
  currencyFormat,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleInputChange = (e) => {
    let inputValue = e.target.value;

    if (currencyFormat && type === 'number') {
      // Remove non-numeric characters
      inputValue = inputValue.replace(/[^0-9]/g, '');

      // Format as currency if needed
      if (inputValue) {
        inputValue = parseInt(inputValue, 10);
      }
    }

    onChange(e, inputValue);
  };

  const formatValue = (val) => {
    if (currencyFormat && type === 'number' && val) {
      return val.toLocaleString('vi-VN');
    }
    return val;
  };

  return (
    <div className='space-y-1 relative'>
      <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
        {label}
      </label>

      <div className='relative'>
        <input
          type={
            type === 'password' ? (showPassword ? 'text' : 'password') : type
          }
          placeholder={placeholder}
          value={formatValue(value)}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          disabled={disabled}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 
            ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}
            ${isSearchable ? 'pr-10' : ''}
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
          `}
        />

        {type === 'password' && (
          <button
            type='button'
            onClick={() => setShowPassword(!showPassword)}
            className='absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500'
          >
            {showPassword ? (
              <EyeOff className='w-4 h-4' />
            ) : (
              <Eye className='w-4 h-4' />
            )}
          </button>
        )}

        {isSearchable && (
          <Search className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
        )}
      </div>

      {error && <p className='text-sm text-red-600'>{error}</p>}

      {/* Search Results Dropdown */}
      {isSearchable &&
        isFocused &&
        searchResults &&
        searchResults.length > 0 && (
          <div className='absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border rounded-lg shadow-lg max-h-60 overflow-y-auto'>
            {searchResults.map((result) => (
              <div
                key={result.id}
                className='p-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer'
                onClick={() => onSearchSelect(result)}
              >
                <div className='font-medium text-gray-900 dark:text-white'>
                  {result.name || result.product_name}
                </div>
                <div className='text-sm text-gray-600 dark:text-gray-400'>
                  {result.product_code}
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
};

export default CustomInput;
