import React from 'react';
import { useSocket } from '../../../contexts/SocketContext';
import { Phone, PhoneOff, UserRound } from 'lucide-react';
import { CALL_STATUS } from './callConstants';

const CallDialog = () => {
  const { activeCall, respondToCall, cancelCall } = useSocket();

  if (!activeCall) return null;

  const isIncoming = activeCall.type === 'incoming';
  const isOutgoing = activeCall.type === 'outgoing';

  const renderCallStatus = () => {
    switch (activeCall.status) {
      case CALL_STATUS.CALLING:
        return `Đang gọi cho ${activeCall.receiverName}...`;
      case CALL_STATUS.RINGING:
        return `Cuộc gọi đến từ ${activeCall.callerName}`;
      case CALL_STATUS.ENDED:
        return activeCall.reason || 'Cuộc gọi đã kết thúc';
      default:
        return '';
    }
  };

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50'>
      <div className='bg-white rounded-xl p-8 w-96 shadow-xl'>
        <div className='flex flex-col items-center gap-6'>
          <div className='relative'>
            {activeCall.callerAvatar || activeCall.receiverAvatar ? (
              <img
                src={
                  isIncoming
                    ? activeCall.callerAvatar
                    : activeCall.receiverAvatar
                }
                alt='Avatar'
                className='w-24 h-24 rounded-full object-cover'
              />
            ) : (
              <div className='w-24 h-24 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center'>
                <UserRound className='w-12 h-12 text-blue-600' />
              </div>
            )}
            {(activeCall.status === CALL_STATUS.CALLING ||
              activeCall.status === CALL_STATUS.RINGING) && (
              <div className='absolute inset-0 animate-ping rounded-full bg-blue-100 opacity-75' />
            )}
          </div>

          <div className='space-y-2 text-center'>
            <p className='text-lg font-medium text-blue-600'>
              {renderCallStatus()}
            </p>
            <h3 className='text-xl font-semibold text-gray-900'>
              {isIncoming ? activeCall.callerName : activeCall.receiverName}
            </h3>
          </div>

          {activeCall.status !== CALL_STATUS.ENDED && (
            <div className='flex items-center gap-6'>
              {isIncoming && activeCall.status === CALL_STATUS.RINGING ? (
                <>
                  <button
                    onClick={() => respondToCall(activeCall.callerEmail, false)}
                    className='p-4 rounded-full bg-red-500 hover:bg-red-600 transition-all shadow-lg hover:shadow-red-200 group'
                  >
                    <PhoneOff className='w-6 h-6 text-white group-hover:scale-110 transition-transform' />
                  </button>

                  <button
                    onClick={() => respondToCall(activeCall.callerEmail, true)}
                    className='p-4 rounded-full bg-green-500 hover:bg-green-600 transition-all shadow-lg hover:shadow-green-200 group'
                  >
                    <Phone className='w-6 h-6 text-white group-hover:scale-110 transition-transform' />
                  </button>
                </>
              ) : isOutgoing && activeCall.status === CALL_STATUS.CALLING ? (
                <button
                  onClick={() => cancelCall(activeCall.receiverEmail)}
                  className='p-4 rounded-full bg-red-500 hover:bg-red-600 transition-all shadow-lg hover:shadow-red-200 group'
                >
                  <PhoneOff className='w-6 h-6 text-white group-hover:scale-110 transition-transform' />
                </button>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CallDialog;
