import React from 'react';

const Checkbox = ({ label, checked, onChange }) => {
  return (
    <div className='flex items-center'>
      <div className='relative'>
        <input
          type='checkbox'
          checked={checked}
          onChange={onChange}
          className='absolute w-6 h-6 opacity-0 cursor-pointer'
        />
        <div
          className={`w-6 h-6 rounded-lg flex items-center justify-center border-2 border-blue-600 ${checked ? 'bg-blue-600' : 'bg-white'}`}
        >
          {checked && (
            <svg
              className='w-3 h-3 text-white'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='3'
                d='M5 13l4 4L19 7'
              ></path>
            </svg>
          )}
        </div>
      </div>
      {label && <label className='ml-2 cursor-pointer'>{label}</label>}
    </div>
  );
};

export default Checkbox;
