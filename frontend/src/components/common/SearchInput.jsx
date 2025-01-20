// SearchInput.jsx
import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

const TypingEffect = ({ text, speed, typingStopped }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (typingStopped) return;

    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[index]);
        setIndex((prev) => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }

    if (index === text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText('');
        setIndex(0);
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [index, text, speed, typingStopped]);

  return <span>{displayedText}</span>;
};

const SearchInput = ({ onSearch, placeholder, bgColor, textColor }) => {
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);

  // Debounced search function
  const debouncedSearch = useCallback(
    (value) => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }

      if (value.trim()) {
        const newTimeout = setTimeout(() => {
          onSearch(value);
        }, 500); // Wait 500ms after user stops typing
        setTypingTimeout(newTimeout);
      } else {
        onSearch(''); // Clear results if input is empty
      }
    },
    [onSearch]
  );

  const handleInputChange = (e) => {
    const input = e.target.value;
    setInputValue(input);
    setIsTyping(input.length > 0);
    debouncedSearch(input);
  };

  const handleFocus = () => {
    setIsTyping(true);
  };

  const handleBlur = () => {
    if (inputValue === '') {
      setIsTyping(false);
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [typingTimeout]);

  return (
    <div className='relative'>
      <label
        htmlFor='default-search'
        className='mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white'
      >
        Search
      </label>
      <div className='relative'>
        <div className='absolute inset-y-0 flex items-center pointer-events-none start-0 ps-3'>
          <svg
            className='w-4 h-4 text-gray-500 dark:text-gray-400'
            aria-hidden='true'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 20 20'
          >
            <path
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z'
            />
          </svg>
        </div>
        <input
          type='search'
          id='default-search'
          className={`block w-full p-4 text-sm border border-gray-300 rounded-lg ps-10 focus:ring-green-500 focus:border-green-500 dark:bg-bgDiv dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500 ${bgColor} ${textColor}`}
          placeholder=''
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        {!isTyping && inputValue === '' && (
          <div
            className={`absolute inset-y-0 flex items-center ${textColor} pointer-events-none start-10 dark:text-gray-400`}
          >
            <TypingEffect
              text={placeholder}
              speed={100}
              typingStopped={isTyping}
            />
          </div>
        )}
      </div>
    </div>
  );
};

SearchInput.propTypes = {
  onSearch: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  bgColor: PropTypes.string,
  textColor: PropTypes.string,
};

export default SearchInput;
