import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import PropTypes from 'prop-types';

const Input = ({
  inputValue,
  disabled,
  labelText,
  typeInput,
  placeholder,
  error,
  value: externalValue = '',
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const input = e.target.value;
    inputValue(input);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className='space-y-2'>
      <label
        htmlFor='input-field'
        className='block text-sm font-medium text-gray-700 dark:text-gray-300'
      >
        {labelText}
      </label>
      <div className='relative'>
        {typeInput === 'textarea' ? (
          <textarea
            id='input-field'
            className='w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white'
            placeholder={placeholder}
            value={externalValue}
            onChange={handleChange}
            disabled={disabled}
            rows={4}
          />
        ) : (
          <input
            type={
              typeInput === 'password'
                ? showPassword
                  ? 'text'
                  : 'password'
                : typeInput
            }
            id='input-field'
            className='w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white'
            placeholder={placeholder}
            value={externalValue}
            onChange={handleChange}
            disabled={disabled}
          />
        )}
        {typeInput === 'password' && (
          <button
            type='button'
            onClick={togglePasswordVisibility}
            className='absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 dark:text-gray-400'
          >
            {showPassword ? (
              <EyeOff className='w-5 h-5' />
            ) : (
              <Eye className='w-5 h-5' />
            )}
          </button>
        )}
      </div>
      {error && (
        <p className='text-xs text-red-600 dark:text-red-400'>
          <span className='italic font-medium'>{error}</span>
        </p>
      )}
    </div>
  );
};

Input.propTypes = {
  inputValue: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  labelText: PropTypes.string.isRequired,
  typeInput: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  value: PropTypes.string,
};

export default Input;
