import React, { useEffect } from 'react';

const NotificationModal = ({ isOpen, onClose, message, type = 'error' }) => {
  useEffect(() => {
    if (isOpen) {
      // Close modal after 3 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 flex items-center justify-center z-50'>
      <div className='fixed inset-0 bg-black bg-opacity-50' onClick={onClose} />
      <div className='bg-white rounded-lg p-6 shadow-xl z-10 max-w-md w-full mx-4 relative'>
        <div
          className={`text-lg font-semibold mb-2 ${type === 'error' ? 'text-red-500' : 'text-green-500'}`}
        >
          {type === 'error' ? 'Error' : 'Success'}
        </div>
        <div className='text-gray-600'>{message}</div>
        <button
          onClick={onClose}
          className='absolute top-2 right-2 text-gray-500 hover:text-gray-700'
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default NotificationModal;
