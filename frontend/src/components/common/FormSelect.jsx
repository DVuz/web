import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const FormSelect = ({
  options = [],
  labelText,
  selectValue,
  value: defaultValue,
}) => {
  const [selectedValue, setSelectedValue] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (defaultValue) {
      setSelectedValue(defaultValue);
    }
  }, [defaultValue]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setSelectedValue(newValue);

    if (!newValue) {
      setError('Please select an option!');
    } else {
      setError('');
      selectValue(newValue);
    }
  };

  return (
    <div className='space-y-2'>
      {/* Label */}
      <label
        htmlFor='select-field'
        className='block text-sm font-medium text-gray-700 dark:text-gray-300'
      >
        {labelText}
      </label>

      {/* Select Dropdown */}
      <select
        id='select-field'
        value={selectedValue}
        onChange={handleChange}
        className={`w-full px-3 py-2 bg-white border ${
          error
            ? 'border-red-600 focus:ring-red-500'
            : 'border-gray-300 focus:ring-green-500'
        } rounded-lg focus:ring-2 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
      >
        <option value='' disabled>
          -- Select an option --
        </option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {/* Error Message */}
      {error && (
        <p className='text-xs text-red-600 dark:text-red-400'>
          <span className='italic font-medium'>{error}</span>
        </p>
      )}
    </div>
  );
};

FormSelect.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  labelText: PropTypes.string.isRequired,
  selectValue: PropTypes.func.isRequired,
  value: PropTypes.string,
};

export default FormSelect;
