// GlobalCallModal.jsx
import React from 'react';
import { useSocket } from '../../../contexts/SocketContext';
import VoiceCall from '../CallMessenger/VoiceCalling';

const GlobalCallModal = () => {
  const { activeCall, socket } = useSocket();
  console.log('Active socket:', socket);

  if (!activeCall) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      <VoiceCall call={activeCall} />
    </div>
  );
};

export default GlobalCallModal;
