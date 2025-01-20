import React, { useState, useEffect, useRef } from 'react';
import { Phone, Mic, Video, VideoOff, MicOff } from 'lucide-react';
import { useWebRTC } from '../../../../contexts/WebRTCContext';
import { useSocket } from '../../../../contexts/SocketContext';

const PersonalCall = ({ roomId }) => {
  const { socket } = useSocket();
  const {
    localStream,
    remoteStream,
    isConnecting,
    error,
    toggleAudio,
    toggleVideo,
    initializeCall,
    leaveCall,
    isConnected,
  } = useWebRTC();

  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [mediaError, setMediaError] = useState(null);
  const [connectionAttempts, setConnectionAttempts] = useState(0);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const hasInitialized = useRef(false);
  const cleanupDone = useRef(false);

  useEffect(() => {
    if (!socket || !roomId || hasInitialized.current) return;

    const setupCall = async () => {
      try {
        console.log('Setting up call for room:', roomId);
        await initializeCall(roomId);
        socket.emit('join:room', roomId);
        setConnectionAttempts((prev) => prev + 1);
        hasInitialized.current = true;
      } catch (err) {
        console.error('Setup call error:', err);
        setMediaError(err.message);
      }
    };

    // Set up logging for important events
    const setupLogging = () => {
      socket.on('room:ready', (data) => {
        console.log('Room ready event received:', data);
        hasInitialized.current = true; // Prevent further initialization attempts
      });

      socket.on('peer:join', (data) => {
        console.log('Peer joined:', data);
      });

      socket.on('peer:leave', (data) => {
        console.log('Peer left:', data);
        if (!cleanupDone.current) {
          handleEndCall();
        }
      });

      socket.on('signal', (data) => {
        console.log('Received signal type:', data.type);
      });
    };

    setupLogging();
    setupCall();

    // Cleanup function
    return () => {
      if (!cleanupDone.current) {
        console.log('Cleaning up call...');
        cleanupDone.current = true;
        socket.off('room:ready');
        socket.off('peer:join');
        socket.off('peer:leave');
        socket.off('signal');
        socket.emit('leave:room', roomId);
        leaveCall();
        hasInitialized.current = false;
      }
    };
  }, [roomId, socket, initializeCall, leaveCall]);

  // Handle local video stream
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  // Handle remote video stream
  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  const handleToggleMic = () => {
    const newState = toggleAudio();
    setIsMicOn(newState);
  };

  const handleToggleVideo = () => {
    const newState = toggleVideo();
    setIsVideoOn(newState);
  };

  const handleEndCall = () => {
    if (!cleanupDone.current) {
      console.log('Ending call');
      cleanupDone.current = true;
      socket.emit('leave:room', roomId);
      leaveCall();
      window.close();
    }
  };

  return (
    <div className='relative h-screen bg-black'>
      <div className='relative h-full w-full'>
        {/* Remote Video */}
        <video
          ref={remoteVideoRef}
          className='h-full w-full object-cover'
          autoPlay
          playsInline
        />

        {!isConnected && (
          <div className='absolute inset-0 flex items-center justify-center bg-black/80 text-white'>
            <div className='text-center'>
              <p className='mb-2'>Waiting for other participant to join...</p>
              <p className='text-sm text-gray-400'>
                Connection attempt: {connectionAttempts}/3
              </p>
            </div>
          </div>
        )}

        {/* Local Video */}
        <video
          ref={localVideoRef}
          className='absolute bottom-4 right-4 h-1/4 w-1/4 rounded-lg object-cover border-2 border-white/20'
          autoPlay
          playsInline
          muted
        />

        {/* Controls */}
        <div className='absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-4 bg-black/40 p-4 rounded-full'>
          <button
            className={`rounded-full p-4 text-white transition-colors duration-200 ${
              isMicOn
                ? 'bg-white/10 hover:bg-white/20'
                : 'bg-red-500 hover:bg-red-600'
            }`}
            onClick={handleToggleMic}
            title={isMicOn ? 'Turn off microphone' : 'Turn on microphone'}
          >
            {isMicOn ? <Mic size={24} /> : <MicOff size={24} />}
          </button>

          <button
            className={`rounded-full p-4 text-white transition-colors duration-200 ${
              isVideoOn
                ? 'bg-white/10 hover:bg-white/20'
                : 'bg-red-500 hover:bg-red-600'
            }`}
            onClick={handleToggleVideo}
            title={isVideoOn ? 'Turn off camera' : 'Turn on camera'}
          >
            {isVideoOn ? <Video size={24} /> : <VideoOff size={24} />}
          </button>

          <button
            className='rounded-full bg-red-500 p-4 text-white hover:bg-red-600 transition-colors duration-200'
            onClick={handleEndCall}
            title='End call'
          >
            <Phone className='rotate-135 transform' size={24} />
          </button>
        </div>

        {/* Connection Status */}
        {isConnecting && (
          <div className='absolute left-4 top-4 flex items-center gap-2 rounded-full bg-black/50 px-4 py-2 text-white'>
            <div className='h-2 w-2 animate-pulse rounded-full bg-blue-500'></div>
            <span>Connecting...</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className='absolute left-1/2 top-4 -translate-x-1/2 rounded-lg bg-red-500/90 px-4 py-2 text-white'>
            <p className='font-medium'>Connection Error</p>
            <p className='text-sm'>{error.message}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalCall;
