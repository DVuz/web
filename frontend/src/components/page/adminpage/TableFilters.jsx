import React, { useState } from 'react';
import { Search, X, Filter } from 'lucide-react';

const TableFilters = ({
  onFilterChange,
  filterConfig,
  showDateFilter = true,
  showStatusFilter = true,
  additionalFilters = [],
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    dateRange: 'all',
    startDate: '',
    endDate: '',
    ...additionalFilters.reduce(
      (acc, filter) => ({
        ...acc,
        [filter.key]: filter.defaultValue || '',
      }),
      {}
    ),
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const defaultFilters = {
      search: '',
      status: 'all',
      dateRange: 'all',
      startDate: '',
      endDate: '',
      ...additionalFilters.reduce(
        (acc, filter) => ({
          ...acc,
          [filter.key]: filter.defaultValue || '',
        }),
        {}
      ),
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  const hasActiveFilters = () => {
    return Object.entries(filters).some(([key, value]) => {
      if (key === 'status' || key === 'dateRange') return value !== 'all';
      if (key === 'search') return value !== '';
      if (key === 'startDate' || key === 'endDate') return value !== '';
      return value !== '' && value !== false;
    });
  };

  return (
    <div className='w-full space-y-4'>
      <div className='flex flex-wrap gap-4'>
        {/* Search Bar */}
        <div className='flex-1 min-w-[200px]'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
            <input
              type='text'
              placeholder={filterConfig?.searchPlaceholder || 'Search...'}
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className='w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            />
          </div>
        </div>

        {/* Filter Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className='px-4 py-2 flex items-center gap-2 border rounded-lg hover:bg-gray-50'
        >
          <Filter className='w-4 h-4' />
          Filters
          {hasActiveFilters() && (
            <span className='px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full'>
              Active
            </span>
          )}
        </button>

        {/* Clear Filters Button */}
        {hasActiveFilters() && (
          <button
            onClick={clearFilters}
            className='px-4 py-2 flex items-center gap-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50'
          >
            <X className='w-4 h-4' />
            Clear Filters
          </button>
        )}
      </div>

      {/* Expanded Filters */}
      {isOpen && (
        <div className='p-4 bg-gray-50 rounded-lg space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
            {/* Status Filter */}
            {showStatusFilter && (
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className='w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                >
                  <option value='all'>All Status</option>
                  <option value='active'>Active</option>
                  <option value='inactive'>Inactive</option>
                </select>
              </div>
            )}

            {/* Date Filter */}
            {showDateFilter && (
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Date Range
                </label>
                <select
                  value={filters.dateRange}
                  onChange={(e) =>
                    handleFilterChange('dateRange', e.target.value)
                  }
                  className='w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                >
                  <option value='all'>All Time</option>
                  <option value='today'>Today</option>
                  <option value='week'>This Week</option>
                  <option value='month'>This Month</option>
                  <option value='custom'>Custom Range</option>
                </select>
              </div>
            )}

            {/* Custom Date Range */}
            {filters.dateRange === 'custom' && (
              <>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Start Date
                  </label>
                  <input
                    type='date'
                    value={filters.startDate}
                    onChange={(e) =>
                      handleFilterChange('startDate', e.target.value)
                    }
                    className='w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    End Date
                  </label>
                  <input
                    type='date'
                    value={filters.endDate}
                    onChange={(e) =>
                      handleFilterChange('endDate', e.target.value)
                    }
                    className='w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                  />
                </div>
              </>
            )}

            {/* Additional Custom Filters */}
            {additionalFilters.map((filter) => (
              <div key={filter.key}>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  {filter.label}
                </label>
                {filter.type === 'select' ? (
                  <select
                    value={filters[filter.key]}
                    onChange={(e) =>
                      handleFilterChange(filter.key, e.target.value)
                    }
                    className='w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                  >
                    {filter.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={filter.type}
                    value={filters[filter.key]}
                    onChange={(e) =>
                      handleFilterChange(filter.key, e.target.value)
                    }
                    placeholder={filter.placeholder}
                    className='w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TableFilters;
