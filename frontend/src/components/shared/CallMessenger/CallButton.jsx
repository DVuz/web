import React, { useState } from 'react';
import { Phone } from 'lucide-react';
import { useSocket } from '../../../contexts/SocketContext';
import { CALL_STATUS } from './CallConstants';

const CallButton = ({ receiverEmail }) => {
  const { initiateCall, onlineUsers, activeCall } = useSocket();
  const [isLoading, setIsLoading] = useState(false);

  const isUserOnline = onlineUsers?.users?.some(
    (user) => user.email === receiverEmail
  );
  const canCall =
    isUserOnline && (!activeCall || activeCall.status === CALL_STATUS.ENDED);

  const handleMakeCall = async () => {
    if (!canCall) return;

    try {
      setIsLoading(true);
      await initiateCall(receiverEmail);
    } catch (error) {
      console.error('Call failed:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleMakeCall}
      disabled={!canCall || isLoading}
      className='p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'
      title={!isUserOnline ? 'User is offline' : 'Start video call'}
    >
      <Phone className={isLoading ? 'animate-pulse' : ''} />
    </button>
  );
};

export default CallButton;
