import React, { useRef, useEffect, useState } from 'react';
import { Phone, PhoneOff } from 'lucide-react';
import { useSocket } from '../contexts/SocketContext';
import { CALL_STATUS } from '../constants/CallConstants';

const VoiceCall = () => {
  const { activeCall, respondToCall, cancelCall } = useSocket();

  const [isProcessing, setIsProcessing] = useState(false);
  const timeoutRef = useRef(null);
  const windowRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      // Close call window if it exists
      if (windowRef.current && !windowRef.current.closed) {
        windowRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    // If call status changes to CONNECTED, ensure the window is open
    if (
      activeCall?.status === CALL_STATUS.CONNECTED &&
      activeCall?.redirectUrl
    ) {
      if (!windowRef.current || windowRef.current.closed) {
        console.log('Opening call window:', activeCall.redirectUrl);
        windowRef.current = window.open(
          activeCall.redirectUrl,
          '_blank',
          'width=800,height=600'
        );
      }
    }
  }, [activeCall?.status, activeCall?.redirectUrl]);

  if (!activeCall || activeCall.status === CALL_STATUS.IDLE) {
    return null;
  }

  const handleAcceptCall = async () => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);
      console.log('Accepting call from:', activeCall.callerEmail);

      if (activeCall.type === 'incoming') {
        await respondToCall(activeCall.callerEmail, true);

        // Wait for the activeCall to be updated with the redirectUrl
        timeoutRef.current = setTimeout(() => {
          if (
            activeCall.redirectUrl &&
            (!windowRef.current || windowRef.current.closed)
          ) {
            console.log('Opening call window after accepting');
            windowRef.current = window.open(
              activeCall.redirectUrl,
              '_blank',
              'width=800,height=600'
            );
          }
        }, 500);
      }
    } catch (error) {
      console.error('Error accepting call:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectCall = async () => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);
      console.log('Rejecting/cancelling call');

      if (activeCall.type === 'incoming') {
        await respondToCall(activeCall.callerEmail, false);
      } else {
        await cancelCall(activeCall.receiverEmail);
      }
    } catch (error) {
      console.error('Error rejecting/cancelling call:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
      <div className='bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center space-y-4 max-w-sm w-full mx-4'>
        {activeCall.type === 'incoming' ? (
          <div className='flex flex-col items-center gap-4'>
            <div className='relative'>
              <img
                src={activeCall.callerAvatar || '/default-avatar.png'}
                alt='Caller'
                className='w-24 h-24 rounded-full object-cover'
              />
              <div className='absolute inset-0 border-4 border-blue-500 rounded-full animate-ping'></div>
            </div>
            <h3 className='text-lg font-medium dark:text-white'>
              {activeCall.callerName || 'Unknown Caller'}
            </h3>
            <p className='text-gray-600 dark:text-gray-300'>Incoming call...</p>
            <div className='flex gap-6'>
              <button
                onClick={handleAcceptCall}
                disabled={isProcessing}
                className='p-4 bg-green-500 rounded-full hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
              >
                <Phone className='text-white' size={24} />
              </button>
              <button
                onClick={handleRejectCall}
                disabled={isProcessing}
                className='p-4 bg-red-500 rounded-full hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
              >
                <PhoneOff className='text-white' size={24} />
              </button>
            </div>
          </div>
        ) : (
          <div className='flex flex-col items-center gap-4'>
            <div className='w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center'>
              <Phone className='text-gray-500 dark:text-gray-400' size={32} />
            </div>
            <h3 className='text-lg font-medium dark:text-white'>
              Calling {activeCall.receiverName || 'User'}...
            </h3>
            <button
              onClick={handleRejectCall}
              disabled={isProcessing}
              className='p-4 bg-red-500 rounded-full hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
            >
              <PhoneOff className='text-white' size={24} />
            </button>
          </div>
        )}

        {isProcessing && (
          <p className='text-sm text-gray-500 dark:text-gray-400'>
            Processing...
          </p>
        )}
      </div>
    </div>
  );
};

export default VoiceCall;
