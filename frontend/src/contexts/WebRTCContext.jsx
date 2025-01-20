import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import { useSocket } from './SocketContext';

const WebRTCContext = createContext();

const configuration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

export function WebRTCProvider({ children }) {
  const { socket } = useSocket();
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [remotePeerId, setRemotePeerId] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const peerConnection = useRef(null);
  const dataChannel = useRef(null);
  const participantsRef = useRef([]);

  const createPeerConnection = useCallback(() => {
    try {
      console.log('Creating new peer connection');
      const pc = new RTCPeerConnection(configuration);

      // Handle ICE candidates
      pc.onicecandidate = (event) => {
        if (event.candidate && socket && remotePeerId) {
          console.log('Sending ICE candidate to:', remotePeerId);
          socket.emit('signal', {
            type: 'ice-candidate',
            data: event.candidate,
            to: remotePeerId,
          });
        }
      };

      pc.oniceconnectionstatechange = () => {
        console.log('ICE connection state changed:', pc.iceConnectionState);
        if (pc.iceConnectionState === 'connected') {
          setIsConnected(true);
        } else if (pc.iceConnectionState === 'disconnected') {
          setIsConnected(false);
        }
      };

      // Handle connection state changes
      pc.onconnectionstatechange = () => {
        console.log('Connection state changed:', pc.connectionState);
        setIsConnected(pc.connectionState === 'connected');
      };

      // Handle receiving remote tracks
      pc.ontrack = (event) => {
        console.log('Received remote track');
        if (event.streams && event.streams[0]) {
          console.log('Setting remote stream');
          setRemoteStream(event.streams[0]);
        }
      };

      // Create data channel for peer messages
      dataChannel.current = pc.createDataChannel('messageChannel', {
        ordered: true,
      });

      dataChannel.current.onopen = () => {
        console.log('Data channel opened');
      };

      dataChannel.current.onclose = () => {
        console.log('Data channel closed');
      };

      dataChannel.current.onmessage = (event) => {
        console.log('Received message:', event.data);
      };

      pc.ondatachannel = (event) => {
        const channel = event.channel;
        channel.onmessage = (e) => {
          console.log('Received message from peer:', e.data);
        };
      };

      peerConnection.current = pc;
      return pc;
    } catch (err) {
      console.error('Error creating peer connection:', err);
      setError(err);
      return null;
    }
  }, [socket, remotePeerId]);

  const startLocalStream = async () => {
    try {
      console.log('Requesting media devices');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      console.log('Got local stream');
      setLocalStream(stream);
      return stream;
    } catch (err) {
      console.error('Error accessing media devices:', err);
      setError(err);
      return null;
    }
  };

  const initializeCall = useCallback(
    async (roomId) => {
      console.log('Initializing call for room:', roomId);
      setIsConnecting(true);
      setError(null);

      try {
        const stream = await startLocalStream();
        if (!stream) {
          throw new Error('Failed to get local stream');
        }

        const pc = createPeerConnection();
        if (!pc) {
          throw new Error('Failed to create peer connection');
        }

        // Add local tracks to peer connection
        stream.getTracks().forEach((track) => {
          console.log('Adding local track:', track.kind);
          pc.addTrack(track, stream);
        });

        // Listen for signaling messages
        socket.on('signal', async ({ type, data, from }) => {
          try {
            console.log('Received signal:', type, 'from:', from);
            if (type === 'offer') {
              setRemotePeerId(from);
              console.log('Setting remote description (offer)');
              await pc.setRemoteDescription(new RTCSessionDescription(data));

              console.log('Creating answer');
              const answer = await pc.createAnswer();
              console.log('Setting local description (answer)');
              await pc.setLocalDescription(answer);

              console.log('Sending answer to:', from);
              socket.emit('signal', {
                type: 'answer',
                data: answer,
                to: from,
              });
            } else if (type === 'answer') {
              console.log('Setting remote description (answer)');
              await pc.setRemoteDescription(new RTCSessionDescription(data));
            } else if (type === 'ice-candidate') {
              console.log('Adding ICE candidate');
              if (pc.remoteDescription) {
                await pc.addIceCandidate(new RTCIceCandidate(data));
              }
            }
          } catch (err) {
            console.error('Signal handling error:', err);
            setError(err);
          }
        });

        // Handle room ready event
        socket.on('room:ready', async ({ participants }) => {
          console.log('Room ready, participants:', participants);
          participantsRef.current = participants;
          const isInitiator = participants[0] === socket.id;
          const otherPeerId = participants.find((id) => id !== socket.id);

          console.log('Is initiator:', isInitiator);
          console.log('Other peer:', otherPeerId);

          setRemotePeerId(otherPeerId);

          if (isInitiator) {
            console.log('Creating offer');
            const offer = await pc.createOffer();
            console.log('Setting local description (offer)');
            await pc.setLocalDescription(offer);

            console.log('Sending offer to:', otherPeerId);
            socket.emit('signal', {
              type: 'offer',
              data: offer,
              to: otherPeerId,
            });
          }
        });
      } catch (err) {
        console.error('Call initialization error:', err);
        setError(err);
      } finally {
        setIsConnecting(false);
      }
    },
    [socket, createPeerConnection]
  );

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        return audioTrack.enabled;
      }
    }
    return false;
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        return videoTrack.enabled;
      }
    }
    return false;
  };

  const leaveCall = useCallback(() => {
    console.log('Leaving call');
    if (localStream) {
      localStream.getTracks().forEach((track) => {
        track.stop();
        console.log('Stopped track:', track.kind);
      });
      setLocalStream(null);
    }

    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
      console.log('Closed peer connection');
    }

    if (dataChannel.current) {
      dataChannel.current.close();
      dataChannel.current = null;
      console.log('Closed data channel');
    }

    setRemoteStream(null);
    setIsConnecting(false);
    setError(null);
    setRemotePeerId(null);
    setIsConnected(false);
    participantsRef.current = [];
  }, []);

  useEffect(() => {
    return () => {
      leaveCall();
    };
  }, [leaveCall]);

  const sendMessage = (message) => {
    if (dataChannel.current?.readyState === 'open') {
      dataChannel.current.send(JSON.stringify(message));
    }
  };

  return (
    <WebRTCContext.Provider
      value={{
        localStream,
        remoteStream,
        isConnecting,
        error,
        initializeCall,
        leaveCall,
        toggleAudio,
        toggleVideo,
        sendMessage,
        isConnected,
      }}
    >
      {children}
    </WebRTCContext.Provider>
  );
}

export const useWebRTC = () => {
  const context = useContext(WebRTCContext);
  if (!context) {
    throw new Error('useWebRTC must be used within a WebRTCProvider');
  }
  return context;
};
