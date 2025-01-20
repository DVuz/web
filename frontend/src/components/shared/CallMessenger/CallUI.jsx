import React, { useState, useEffect } from 'react';
import {
  BsTelephone,
  BsTelephoneX,
  BsTelephoneOutbound,
  BsTelephoneInbound,
} from 'react-icons/bs';
import { IoClose } from 'react-icons/io5';

const CallUI = ({
  activeCall,
  onMakeCall,
  onAcceptCall,
  onRejectCall,
  onEndCall,
  onCancelCall,
}) => {
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    let interval;
    if (activeCall?.type === 'active') {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(interval);
  }, [activeCall?.type]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getCallStatusMessage = () => {
    if (!activeCall) return '';

    switch (activeCall.type) {
      case 'incoming':
        return `Cuộc gọi đến từ ${activeCall.email}`;
      case 'outgoing':
        return `Đang gọi cho ${activeCall.email}...`;
      case 'active':
        return `Đang trong cuộc gọi với ${activeCall.email}`;
      case 'rejected':
        return `${activeCall.email} đã từ chối cuộc gọi`;
      case 'missed':
        return `Cuộc gọi nhỡ từ ${activeCall.email}`;
      case 'cancelled':
        return 'Cuộc gọi đã bị hủy';
      case 'ended':
        return 'Cuộc gọi đã kết thúc';
      default:
        return '';
    }
  };

  if (!activeCall) {
    return (
      <button
        onClick={onMakeCall}
        className='p-4 bg-green-500 rounded-full hover:bg-green-600 transition-all duration-300 transform hover:scale-110 shadow-lg'
        aria-label='Bắt đầu cuộc gọi'
      >
        <BsTelephoneOutbound className='text-white text-2xl' />
      </button>
    );
  }

  return (
    <div className='fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-md'>
      <div className='bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-2xl text-center max-w-md w-full mx-4 relative animate-fadeIn'>
        {/* Close button */}
        {['rejected', 'missed', 'cancelled', 'ended'].includes(
          activeCall.type
        ) && (
          <button
            onClick={onEndCall}
            className='absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all'
          >
            <IoClose className='text-2xl' />
          </button>
        )}

        {/* Avatar */}
        <div className='w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-xl'>
          <span className='text-3xl font-semibold text-white'>
            {activeCall.email?.charAt(0).toUpperCase()}
          </span>
        </div>

        {/* Status message */}
        <h3 className='text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100'>
          {getCallStatusMessage()}
        </h3>

        {/* Timer for active calls */}
        {activeCall.type === 'active' && (
          <p className='text-lg text-gray-500 dark:text-gray-400 mb-8 font-mono'>
            {formatTime(callDuration)}
          </p>
        )}

        {/* Action buttons */}
        <div className='flex gap-8 justify-center items-center'>
          {activeCall.type === 'incoming' && (
            <>
              <button
                onClick={onAcceptCall}
                className='p-5 bg-green-500 rounded-full hover:bg-green-600 transition-all duration-300 transform hover:scale-110 shadow-lg group'
              >
                <BsTelephoneInbound className='text-white text-2xl group-hover:rotate-12 transition-transform' />
                <span className='sr-only'>Trả lời</span>
              </button>
              <button
                onClick={onRejectCall}
                className='p-5 bg-red-500 rounded-full hover:bg-red-600 transition-all duration-300 transform hover:scale-110 shadow-lg group'
              >
                <BsTelephoneX className='text-white text-2xl group-hover:-rotate-12 transition-transform' />
                <span className='sr-only'>Từ chối</span>
              </button>
            </>
          )}

          {activeCall.type === 'outgoing' && (
            <button
              onClick={onCancelCall}
              className='p-5 bg-red-500 rounded-full hover:bg-red-600 transition-all duration-300 transform hover:scale-110 shadow-lg group'
            >
              <BsTelephoneX className='text-white text-2xl group-hover:rotate-12 transition-transform' />
              <span className='sr-only'>Hủy cuộc gọi</span>
            </button>
          )}

          {activeCall.type === 'active' && (
            <button
              onClick={onEndCall}
              className='p-5 bg-red-500 rounded-full hover:bg-red-600 transition-all duration-300 transform hover:scale-110 shadow-lg group'
            >
              <BsTelephone className='text-white text-2xl rotate-135 group-hover:rotate-180 transition-transform' />
              <span className='sr-only'>Kết thúc cuộc gọi</span>
            </button>
          )}

          {['rejected', 'missed', 'cancelled'].includes(activeCall.type) && (
            <button
              onClick={onMakeCall}
              className='p-5 bg-green-500 rounded-full hover:bg-green-600 transition-all duration-300 transform hover:scale-110 shadow-lg group'
            >
              <BsTelephoneOutbound className='text-white text-2xl group-hover:rotate-12 transition-transform' />
              <span className='sr-only'>Gọi lại</span>
            </button>
          )}
        </div>

        {/* Additional message for specific states */}
        {['rejected', 'missed', 'cancelled', 'ended'].includes(
          activeCall.type
        ) && (
          <p className='mt-8 text-sm text-gray-500 dark:text-gray-400'>
            Nhấn để gọi lại hoặc đóng để thoát
          </p>
        )}
      </div>
    </div>
  );
};

export default CallUI;
