import React, { useState, useEffect } from 'react';
import { MdArrowDropDown, MdArrowDropUp } from 'react-icons/md';
import PropTypes from 'prop-types';

const Pagination = ({
  totalItems,
  itemsPerPageOptions,
  onPageChange,
  currentPage: propCurrentPage,
  itemsPerPage: propItemsPerPage,
}) => {
  const [currentPage, setCurrentPage] = useState(propCurrentPage || 1);
  const [itemsPerPage, setItemsPerPage] = useState(
    propItemsPerPage || parseInt(itemsPerPageOptions[0].split(' ')[0], 10)
  );
  const [goToPage, setGoToPage] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Update state when props change
  useEffect(() => {
    if (propCurrentPage && propCurrentPage !== currentPage) {
      setCurrentPage(propCurrentPage);
    }
    if (propItemsPerPage && propItemsPerPage !== itemsPerPage) {
      setItemsPerPage(propItemsPerPage);
    }
  }, [propCurrentPage, propItemsPerPage]);

  // Update currentPage if it exceeds totalPages
  useEffect(() => {
    if (currentPage > totalPages) {
      handlePageChange(totalPages);
    }
  }, [totalPages]);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleItemsPerPageChange = (option) => {
    const newItemsPerPage = parseInt(option.split(' ')[0], 10);
    if (newItemsPerPage !== itemsPerPage) {
      setItemsPerPage(newItemsPerPage);
      onPageChange(1, newItemsPerPage);
      setCurrentPage(1);
    }
    setIsDropdownOpen(false);
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
      onPageChange(page, itemsPerPage);
      setGoToPage('');
    }
  };

  const generatePageNumbers = () => {
    let pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages = [1, 2, 3, '...', totalPages];
      } else if (currentPage > 3 && currentPage < totalPages - 2) {
        pages = [
          1,
          '...',
          currentPage - 1,
          currentPage,
          currentPage + 1,
          '...',
          totalPages,
        ];
      } else {
        pages = [1, '...', totalPages - 2, totalPages - 1, totalPages];
      }
    }
    return pages;
  };

  const handleGoToPageChange = (e) => {
    setGoToPage(e.target.value);
  };

  const handleGoToPageSubmit = () => {
    const page = parseInt(goToPage, 10);
    if (!isNaN(page) && page > 0 && page <= totalPages) {
      handlePageChange(page);
    }
  };

  return (
    <div className='flex items-center justify-between space-x-4'>
      {/* Dropdown for items per page */}
      <div className='relative inline-block text-left w-32'>
        <button
          type='button'
          className='inline-flex justify-between w-full rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 bg-transparent text-sm font-medium text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
          onClick={toggleDropdown}
        >
          {itemsPerPage} /page
          {isDropdownOpen ? (
            <MdArrowDropUp className='ml-2 text-xl' />
          ) : (
            <MdArrowDropDown className='ml-2 text-xl' />
          )}
        </button>

        {isDropdownOpen && (
          <div className='absolute left-0 mt-2 w-full rounded-md shadow-lg bg-white dark:bg-darkBg ring-1 ring-black ring-opacity-5 dark:ring-gray-700 focus:outline-none'>
            <div
              className='py-1 px-2'
              role='menu'
              aria-orientation='vertical'
              aria-labelledby='items-per-page-menu'
            >
              {itemsPerPageOptions.map((option, index) => (
                <div
                  key={index}
                  className='block px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-green-300 dark:hover:bg-green-800 hover:text-gray-900 cursor-pointer mx-1 rounded-md'
                  onClick={() => handleItemsPerPageChange(option)}
                >
                  {option}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Go to page input */}
      <div className='flex items-center space-x-2'>
        <span className='text-gray-700 dark:text-gray-300'>Go to page:</span>
        <input
          type='text'
          value={goToPage}
          onChange={handleGoToPageChange}
          className='px-2 py-1 text-gray-900 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600'
          style={{ width: '50px' }}
        />
        <button
          onClick={handleGoToPageSubmit}
          className='px-3 py-1 text-white bg-green-500 rounded-md'
        >
          Go
        </button>
      </div>

      {/* Pagination buttons */}
      <div className='flex items-center justify-center space-x-1'>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          className={`px-3 py-1 rounded-lg border ${
            currentPage === 1
              ? 'text-gray-400'
              : 'text-black dark:text-gray-300'
          } border-gray-300 dark:border-gray-600`}
          disabled={currentPage === 1}
        >
          {'<'}
        </button>
        {generatePageNumbers().map((page, index) =>
          typeof page === 'number' ? (
            <button
              key={index}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 rounded-lg border ${
                page === currentPage
                  ? 'bg-green-500 text-white border-green-700'
                  : 'text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
              }`}
            >
              {page}
            </button>
          ) : (
            <span
              key={index}
              className='mx-1 text-sm text-gray-700 dark:text-gray-300'
            >
              {page}
            </span>
          )
        )}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          className={`px-3 py-1 rounded-lg border ${
            currentPage === totalPages
              ? 'text-gray-400'
              : 'text-black dark:text-gray-300'
          } border-gray-300 dark:border-gray-600`}
          disabled={currentPage === totalPages}
        >
          {'>'}
        </button>
      </div>
    </div>
  );
};

Pagination.propTypes = {
  totalItems: PropTypes.number.isRequired,
  itemsPerPageOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  onPageChange: PropTypes.func.isRequired,
  currentPage: PropTypes.number,
  itemsPerPage: PropTypes.number,
};

export default Pagination;
