import React, { useState, useEffect } from 'react';

const MultiSelect = ({
  label = 'Select Items',
  placeholder = 'Select option',
  options = [],
  onSelectionChange,
  defaultValue = [],
  error,
}) => {
  const [selectedItems, setSelectedItems] = useState(defaultValue);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (defaultValue) {
      setSelectedItems(defaultValue);
    }
  }, [defaultValue]);

  const handleSelect = (event) => {
    const selectedItem = event.target.value;
    if (!selectedItems.includes(selectedItem) && selectedItem) {
      const newSelectedItems = [...selectedItems, selectedItem];
      setSelectedItems(newSelectedItems);
      onSelectionChange?.(newSelectedItems);
    }
  };

  const removeItem = (itemToRemove) => {
    const updatedItems = selectedItems.filter((item) => item !== itemToRemove);
    setSelectedItems(updatedItems);
    onSelectionChange?.(updatedItems);
  };

  const clearAll = () => {
    setSelectedItems([]);
    onSelectionChange?.([]);
  };

  const availableItems = options.filter(
    (item) => !selectedItems.includes(item)
  );

  return (
    <div className='p-4'>
      <div className='relative'>
        <div
          className='flex items-center min-h-[40px] p-2 border border-gray-300 rounded dark:bg-slate-800'
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className='flex-1 flex flex-wrap items-center gap-2 pr-12'>
            {selectedItems.length === 0 ? (
              <span className='text-gray-500 dark:text-gray-400 px-2'>
                {label}
              </span>
            ) : (
              selectedItems.map((item) => (
                <div
                  key={item}
                  className='flex items-center px-2 py-1 bg-gray-200 rounded dark:bg-slate-700'
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className='mr-2'>{item}</span>
                  <button
                    type='button'
                    onClick={() => removeItem(item)}
                    className='text-red-500 hover:text-red-700 text-sm font-bold'
                    aria-label={`Remove ${item}`}
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>

          {selectedItems.length > 0 && (
            <div className='absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2 pl-2'>
              <button
                type='button'
                onClick={(e) => {
                  e.stopPropagation();
                  clearAll();
                }}
                className='text-red-500 hover:text-red-700 text-xl p-1'
                aria-label='Clear all selections'
              >
                ×
              </button>
              <svg
                className='w-4 h-4 text-gray-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M19 9l-7 7-7-7'
                />
              </svg>
            </div>
          )}

          {isOpen && availableItems.length > 0 && (
            <div className='absolute left-0 right-0 top-full mt-1 bg-white dark:bg-slate-800 border border-gray-300 rounded shadow-lg z-50'>
              {availableItems.map((item) => (
                <div
                  key={item}
                  className='px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer'
                  onClick={(e) => {
                    e.stopPropagation();
                    const newSelectedItems = [...selectedItems, item];
                    setSelectedItems(newSelectedItems);
                    onSelectionChange?.(newSelectedItems);
                    setIsOpen(false);
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {error && <p className='mt-1 text-sm text-red-600'>{error}</p>}
    </div>
  );
};

export default MultiSelect;
