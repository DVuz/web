import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import useAuth from '../hooks/useAuth';

const SocketContext = createContext();

export const CALL_STATUS = {
  IDLE: 'idle',
  CALLING: 'calling',
  RINGING: 'ringing',
  CONNECTED: 'connected',
  ENDED: 'ended',
  ERROR: 'error',
};

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const socketUrl = import.meta.env.VITE_SOCKET_URL;
  const [socket, setSocket] = useState(null);
  const [socketID, setSocketID] = useState('');
  const [onlineUsers, setOnlineUsers] = useState({ count: 0, users: [] });
  const [activeCall, setActiveCall] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.accessToken) return;

    const newSocket = io(socketUrl, {
      withCredentials: true,
      transportOptions: {
        polling: {
          extraHeaders: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        },
      },
    });

    const handleConnect = () => {
      if (user?.decodedToken?.email) {
        newSocket.emit('userLogin', {
          email: user.decodedToken.email,
          name: user.decodedToken.name || user.decodedToken.email,
          avatar: user.decodedToken.avatar || null,
        });
      }
    };

    newSocket.on('connect', handleConnect);
    newSocket.on('socketID', setSocketID);
    newSocket.on('onlineUsers', setOnlineUsers);

    // Call event handlers
    newSocket.on('callStatus', handleCallStatus);
    newSocket.on('incomingCall', handleIncomingCall);
    newSocket.on('callRejected', handleCallRejected);
    newSocket.on('callAccepted', handleCallAccepted);
    newSocket.on('callCancelled', handleCallCancelled);
    newSocket.on('callTimeout', handleCallTimeout);

    setSocket(newSocket);

    return () => {
      newSocket.off('connect', handleConnect);
      newSocket.off('socketID');
      newSocket.off('onlineUsers');
      newSocket.off('callStatus');
      newSocket.off('incomingCall');
      newSocket.off('callRejected');
      newSocket.off('callAccepted');
      newSocket.off('callCancelled');
      newSocket.off('callTimeout');
      newSocket.disconnect();
    };
  }, [socketUrl, user]);

  const handleCallStatus = (data) => {
    setActiveCall({
      type: 'outgoing',
      status: data.status,
      receiverEmail: data.receiverEmail,
      receiverName: data.receiverName,
      startTime: new Date(),
    });
  };

  const handleIncomingCall = (data) => {
    setActiveCall({
      type: 'incoming',
      status: CALL_STATUS.RINGING,
      callerEmail: data.callerEmail,
      callerName: data.callerName,
      callerAvatar: data.callerAvatar,
      startTime: new Date(),
    });
  };

  const handleCallRejected = (data) => {
    setActiveCall((prev) => ({
      ...prev,
      status: CALL_STATUS.ENDED,
      reason: data.reason,
    }));
    setTimeout(() => setActiveCall(null), 3000);
  };

  const handleCallAccepted = (data) => {
    setActiveCall((prev) => ({
      ...prev,
      status: CALL_STATUS.CONNECTED,
      roomId: data.roomId,
    }));

    window.open(data.redirectUrl, '_blank', 'width=800,height=600');
    setTimeout(() => setActiveCall(null), 1000);
  };

  const handleCallCancelled = (data) => {
    setActiveCall((prev) => ({
      ...prev,
      status: CALL_STATUS.ENDED,
      reason: data.reason,
    }));
    setTimeout(() => setActiveCall(null), 3000);
  };

  const handleCallTimeout = (data) => {
    setActiveCall((prev) => ({
      ...prev,
      status: CALL_STATUS.ENDED,
      reason: 'No answer',
    }));
    setTimeout(() => setActiveCall(null), 3000);
  };

  const initiateCall = async (receiverEmail) => {
    if (!socket) throw new Error('Socket not connected');

    socket.emit('initiateCall', {
      callerEmail: user.decodedToken.email,
      receiverEmail,
    });
  };

  const respondToCall = async (callerEmail, accepted) => {
    if (!socket) throw new Error('Socket not connected');

    socket.emit('callResponse', {
      callerEmail,
      receiverEmail: user.decodedToken.email,
      accepted,
    });

    if (!accepted) {
      setActiveCall((prev) => ({
        ...prev,
        status: CALL_STATUS.ENDED,
        reason: 'Call rejected',
      }));
      setTimeout(() => setActiveCall(null), 3000);
    }
  };

  const cancelCall = async (receiverEmail) => {
    if (!socket) throw new Error('Socket not connected');

    socket.emit('cancelCall', {
      callerEmail: user.decodedToken.email,
      receiverEmail,
    });

    setActiveCall((prev) => ({
      ...prev,
      status: CALL_STATUS.ENDED,
      reason: 'Call cancelled',
    }));
    setTimeout(() => setActiveCall(null), 3000);
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        socketID,
        onlineUsers,
        activeCall,
        initiateCall,
        respondToCall,
        cancelCall,
        CALL_STATUS,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
