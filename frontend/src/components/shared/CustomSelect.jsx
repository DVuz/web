import React, { useState, useEffect } from 'react';

const CustomSelect = ({ 
  options = [], 
  labelText, 
  setlectValue, 
  value: initialValue,
  className = "" 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  // Initialize selected option based on value prop
  useEffect(() => {
    if (initialValue) {
      const option = options.find(opt => opt.value === initialValue);
      if (option) {
        setSelectedOption(option);
      }
    }
  }, [initialValue, options]);

  const toggleDropdown = () => setIsOpen(prev => !prev);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setlectValue(option.value);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest('.custom-select')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  return (
    <div className={`custom-select relative w-full ${className}`}>
      <button
        type="button"
        onClick={toggleDropdown}
        className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-mainYellow focus:border-mainYellow"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {selectedOption ? (
              <>
                {selectedOption.flag && (
                  <img 
                    src={selectedOption.flag} 
                    alt={`${selectedOption.label} flag`}
                    className="w-6 h-4 object-cover"
                  />
                )}
                <span>{selectedOption.label}</span>
              </>
            ) : (
              <span className="text-gray-400">{labelText || "Select an option"}</span>
            )}
          </div>
          <svg
            className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {options.map((option, index) => (
            <button
              key={option.value}
              className={`w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2
                ${selectedOption?.value === option.value ? 'bg-gray-50' : ''}
                ${index !== options.length - 1 ? 'border-b border-gray-200' : ''}`}
              onClick={() => handleOptionClick(option)}
            >
              {option.flag && (
                <img 
                  src={option.flag} 
                  alt={`${option.label} flag`}
                  className="w-6 h-4 object-cover"
                />
              )}
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;