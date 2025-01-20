import React, { useState, useEffect } from 'react';
import { MdArrowDropDown, MdArrowDropUp } from 'react-icons/md'; // Import icons
import PropTypes from 'prop-types';

const Dropdown = ({ options, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(options[0]);

  useEffect(() => {
    onSelect(selectedOption);
  }, [selectedOption, onSelect]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    toggleDropdown();
  };

  return (
    <div className='relative inline-block text-left w-32'>
      <div>
        <button
          type='button'
          className='inline-flex justify-between w-full rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 bg-transparent text-sm font-medium text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
          onClick={toggleDropdown}
        >
          {selectedOption}
          {isOpen ? (
            <MdArrowDropUp className='ml-2 text-xl' />
          ) : (
            <MdArrowDropDown className='ml-2 text-xl' />
          )}
        </button>
      </div>

      {isOpen && (
        <div className='absolute left-0 mt-2 w-full rounded-md shadow-lg bg-white dark:bg-darkBg ring-1 ring-black ring-opacity-5 dark:ring-gray-700 focus:outline-none'>
          <div
            className='py-1 px-2'
            role='menu'
            aria-orientation='vertical'
            aria-labelledby='options-menu'
          >
            {options.map((option, index) => (
              <div
                key={index}
                className='block px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-green-300 dark:hover:bg-green-800 hover:text-gray-900 cursor-pointer mx-1 rounded-md'
                onClick={() => handleOptionClick(option)}
              >
                {option}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

Dropdown.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default Dropdown;
