import React from 'react';
import PropTypes from 'prop-types';

const MessagePreview = ({ avatar, name, message, time }) => {
  return (
    <div className='flex items-center max-w-sm px-4 py-4 mx-auto transition-all duration-300 border-gray-200 shadow-md cursor-pointer rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-xl hover:scale-105'>
      <div className='flex-shrink-0'>
        <img
          className='object-cover w-16 h-16 transition-transform duration-300 rounded-full hover:scale-110'
          src={avatar}
          alt={name}
        />
      </div>
      <div className='flex-1 min-w-0 ml-4 '>
        <div className='flex items-center justify-between'>
          <p className='text-base font-medium text-gray-900 truncate transition-colors duration-300 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400'>
            {name}
          </p>
          <p className='text-sm text-gray-500 transition-colors duration-300 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-300'>
            {time}
          </p>
        </div>
        <p className='text-sm text-gray-500 truncate transition-colors duration-300 dark:text-gray-300 group-hover:text-gray-700 dark:group-hover:text-gray-200'>
          {message}
        </p>
      </div>
    </div>
  );
};

MessagePreview.propTypes = {
  avatar: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
};

export default MessagePreview;
