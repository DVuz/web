// SearchWithTyping.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchResultsDropdown from './SearchResultsProduct';

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

const SearchWithTyping = ({ 
  onSearchResults, 
  placeholder = "Search...", 
  bgColor = "bg-white", 
  textColor = "text-gray-900", 
  apiEndpoint 
}) => {
  const [searchResults, setSearchResults] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  // Handle click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowDropdown(false);
        setInputValue('');
        setSearchResults(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle Escape key press
  useEffect(() => {
    function handleEscapeKey(event) {
      if (event.key === 'Escape') {
        setShowDropdown(false);
        setInputValue('');
        setSearchResults(null);
      }
    }

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  const fetchSearchResults = async (searchQuery) => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({ search: searchQuery });
      const response = await fetch(`${apiEndpoint}?${params.toString()}`);
      const result = await response.json();
      
      if (result.success) {
        setSearchResults(result.data);
        setShowDropdown(true);
        if (onSearchResults) {
          onSearchResults(result.data);
        }
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
      setSearchResults(null);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedSearch = useCallback(
    (value) => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }

      if (value.trim()) {
        const newTimeout = setTimeout(() => {
          fetchSearchResults(value);
        }, 500);
        setTypingTimeout(newTimeout);
      } else {
        setSearchResults(null);
        setShowDropdown(false);
        if (onSearchResults) {
          onSearchResults(null);
        }
      }
    },
    [typingTimeout, onSearchResults]
  );

  const handleInputChange = (e) => {
    const input = e.target.value;
    setInputValue(input);
    setIsTyping(input.length > 0);
    debouncedSearch(input);
  };

  const handleSelectProduct = (product) => {
    setInputValue('');
    setSearchResults(null);
    setShowDropdown(false);
    setIsTyping(false);
  };

  const handleFocus = () => {
    setIsTyping(true);
    if (searchResults) {
      setShowDropdown(true);
    }
  };

  useEffect(() => {
    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [typingTimeout]);

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <label 
        htmlFor="search-input" 
        className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
      >
        Search
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 flex items-center pointer-events-none start-0 ps-3">
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
          ) : (
            <svg 
              className="w-4 h-4 text-gray-500 dark:text-gray-400" 
              aria-hidden="true" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 20 20"
            >
              <path 
                stroke="currentColor" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" 
              />
            </svg>
          )}
        </div>
        <input
          type="search"
          id="search-input"
          className={`block w-full p-4 text-sm border border-gray-300 rounded-lg ps-10 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500 ${bgColor} ${textColor}`}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          placeholder=""
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
      {showDropdown && (
        <SearchResultsDropdown 
          results={searchResults}
          onSelectProduct={handleSelectProduct}
          onClose={() => {
            setShowDropdown(false);
            setInputValue('');
            setSearchResults(null);
          }}
        />
      )}
    </div>
  );
};

export default SearchWithTyping;