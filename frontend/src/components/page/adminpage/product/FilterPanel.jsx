import React, { useState } from 'react';
import { X, Filter, Search, AlertCircle } from 'lucide-react';
import { Toast } from './Toast';

const FilterPanel = ({ onFilter, onClose, fields }) => {
  const [filters, setFilters] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = (field, value) => {
    if (value === '' || value === 'all') {
      const newFilters = { ...filters };
      delete newFilters[field];
      setFilters(newFilters);
    } else {
      setFilters((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleDateRangeChange = (type, value) => {
    setDateRange((prev) => ({ ...prev, [type]: value }));
  };

  const applyFilters = () => {
    // Validate date range if both dates are provided
    if (
      (dateRange.start && !dateRange.end) ||
      (!dateRange.start && dateRange.end)
    ) {
      setToastMessage('Please select both start and end dates');
      setShowToast(true);
      return;
    }

    const appliedFilters = {
      ...filters,
      ...(dateRange.start &&
        dateRange.end && {
          dateRange: {
            start: dateRange.start,
            end: dateRange.end,
          },
        }),
    };

    if (Object.keys(appliedFilters).length === 0) {
      setToastMessage('Please select at least one filter');
      setShowToast(true);
      return;
    }

    onFilter(appliedFilters);
    setToastMessage('Filters applied successfully');
    setShowToast(true);
  };

  const clearFilters = () => {
    setFilters({});
    setDateRange({ start: '', end: '' });
    onFilter({});
    setToastMessage('Filters cleared');
    setShowToast(true);
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-20 z-50'>
      <div className='bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto'>
        <div className='flex justify-between items-center mb-6'>
          <div className='flex items-center gap-2'>
            <Filter className='w-5 h-5' />
            <h3 className='text-lg font-semibold'>Advanced Filters</h3>
          </div>
          <button
            onClick={onClose}
            className='text-gray-500 hover:text-gray-700'
          >
            <X className='w-5 h-5' />
          </button>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
          {/* Status Filter */}
          <div>
            <label className='block text-sm font-medium mb-1'>Status</label>
            <select
              value={filters.status || 'all'}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className='w-full p-2 border rounded focus:ring-2 focus:ring-blue-500'
            >
              <option value='all'>All Statuses</option>
              <option value='active'>Active</option>
              <option value='inactive'>Inactive</option>
              <option value='pending'>Pending</option>
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <label className='block text-sm font-medium mb-1'>Type</label>
            <select
              value={filters.type || 'all'}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className='w-full p-2 border rounded focus:ring-2 focus:ring-blue-500'
            >
              <option value='all'>All Types</option>
              <option value='retail'>Retail</option>
              <option value='wholesale'>Wholesale</option>
              <option value='distribution'>Distribution</option>
            </select>
          </div>

          {/* Location Filter */}
          <div>
            <label className='block text-sm font-medium mb-1'>Location</label>
            <select
              value={filters.location || 'all'}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className='w-full p-2 border rounded focus:ring-2 focus:ring-blue-500'
            >
              <option value='all'>All Locations</option>
              <option value='north'>North</option>
              <option value='south'>South</option>
              <option value='central'>Central</option>
            </select>
          </div>

          {/* Price Range Filter */}
          <div>
            <label className='block text-sm font-medium mb-1'>
              Price Range
            </label>
            <select
              value={filters.priceRange || 'all'}
              onChange={(e) => handleFilterChange('priceRange', e.target.value)}
              className='w-full p-2 border rounded focus:ring-2 focus:ring-blue-500'
            >
              <option value='all'>All Prices</option>
              <option value='0-100'>$0 - $100</option>
              <option value='101-500'>$101 - $500</option>
              <option value='501-1000'>$501 - $1000</option>
              <option value='1001+'>$1001+</option>
            </select>
          </div>

          {/* Date Range Filter */}
          <div className='md:col-span-2 grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium mb-1'>
                Start Date
              </label>
              <input
                type='date'
                value={dateRange.start}
                onChange={(e) => handleDateRangeChange('start', e.target.value)}
                className='w-full p-2 border rounded focus:ring-2 focus:ring-blue-500'
              />
            </div>
            <div>
              <label className='block text-sm font-medium mb-1'>End Date</label>
              <input
                type='date'
                value={dateRange.end}
                onChange={(e) => handleDateRangeChange('end', e.target.value)}
                className='w-full p-2 border rounded focus:ring-2 focus:ring-blue-500'
              />
            </div>
          </div>

          {/* Search Filter */}
          <div className='md:col-span-2'>
            <label className='block text-sm font-medium mb-1'>Search</label>
            <div className='relative'>
              <input
                type='text'
                placeholder='Search by name, email, or ID...'
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className='w-full p-2 pl-10 border rounded focus:ring-2 focus:ring-blue-500'
              />
              <Search className='w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
            </div>
          </div>
        </div>

        <div className='flex justify-end gap-4'>
          <button
            onClick={clearFilters}
            className='px-4 py-2 text-gray-600 border rounded hover:bg-gray-50'
          >
            Clear Filters
          </button>
          <button
            onClick={applyFilters}
            className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
          >
            Apply Filters
          </button>
        </div>

        {/* Toast Notification */}
        {showToast && (
          <Toast
            message={toastMessage}
            type={
              toastMessage.includes('Please select') ? 'warning' : 'success'
            }
            onClose={() => setShowToast(false)}
            duration={3000}
          />
        )}
      </div>
    </div>
  );
};

// Toast component
const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  React.useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <div
      className={`fixed bottom-4 right-4 flex items-center gap-2 text-white px-4 py-2 rounded-lg shadow-lg z-50 ${getToastStyles()}`}
    >
      {type === 'warning' && <AlertCircle className='w-5 h-5' />}
      {message}
      <button onClick={onClose} className='ml-2'>
        <X className='w-4 h-4' />
      </button>
    </div>
  );
};

export default FilterPanel;
