import React from 'react';
import { useSocket } from '../contexts/SocketContext';

const MyComponent = () => {
  const { socket, socketID, socketUser } = useSocket();

  const sendMessage = () => {
    if (socket) {
      socket.emit('message', 'Hello from MyComponent!');
    }
  };

  return (
    <div>
      <p>Socket ID: {socketID}</p>
      <p>Socket User: {socketUser}</p>
    </div>
  );
};

export default MyComponent;
