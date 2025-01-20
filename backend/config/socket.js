const socketIo = require('socket.io');
const WebRTCService = require('../services/WebRTCService');
const webRTCService = new WebRTCService();

const CALL_STATUS = {
  IDLE: 'idle',
  CALLING: 'calling', // A đang gọi cho B
  RINGING: 'ringing', // B đang nhận cuộc gọi từ A
  CONNECTED: 'connected',
  ENDED: 'ended',
  ERROR: 'error',
};

class CallManager {
  constructor(io) {
    this.io = io;
    this.userSocketMap = new Map(); // email -> { sockets: [], name, avatar }
    this.onlineUsers = new Set(); // Set of online user emails
    this.activeCallMap = new Map(); // callerEmail -> { receiverEmail, status, startTime }
    this.CALL_TIMEOUT = 5000; // 5 seconds
  }

  addUserSocket(email, socketId, name, avatar) {
    if (!this.userSocketMap.has(email)) {
      this.userSocketMap.set(email, { sockets: [], name, avatar });
      this.onlineUsers.add(email);
    }

    const userInfo = this.userSocketMap.get(email);
    userInfo.sockets.push(socketId);
    userInfo.name = name || email;
    userInfo.avatar = avatar;

    return this.getOnlineUsers();
  }

  removeUserSocket(socketId) {
    let disconnectedEmail = null;
    let remainingSockets = [];

    for (const [email, userInfo] of this.userSocketMap.entries()) {
      const index = userInfo.sockets.indexOf(socketId);
      if (index !== -1) {
        disconnectedEmail = email;
        userInfo.sockets.splice(index, 1);
        remainingSockets = userInfo.sockets;

        if (userInfo.sockets.length === 0) {
          this.userSocketMap.delete(email);
          this.onlineUsers.delete(email);
          this.cleanupCalls(email);
        }
        break;
      }
    }

    return { disconnectedEmail, remainingSockets };
  }

  getUserInfo(email) {
    return this.userSocketMap.get(email);
  }

  getOnlineUsers() {
    return {
      count: this.onlineUsers.size,
      users: Array.from(this.onlineUsers).map((email) => ({
        email,
        name: this.userSocketMap.get(email).name,
        avatar: this.userSocketMap.get(email).avatar,
      })),
    };
  }

  createCall(callerEmail, receiverEmail) {
    if (
      this.activeCallMap.has(callerEmail) ||
      this.activeCallMap.has(receiverEmail)
    ) {
      return false;
    }

    const timeoutId = setTimeout(() => {
      const call = this.activeCallMap.get(callerEmail);
      if (call && call.status === CALL_STATUS.CALLING) {
        this.endCall(callerEmail, 'No answer');

        const callerInfo = this.getUserInfo(callerEmail);
        const receiverInfo = this.getUserInfo(receiverEmail);

        // Notify caller
        if (callerInfo) {
          callerInfo.sockets.forEach((socketId) => {
            this.io.to(socketId).emit('callTimeout', {
              status: CALL_STATUS.ENDED,
              reason: 'No answer',
            });
          });
        }

        // Notify receiver
        if (receiverInfo) {
          receiverInfo.sockets.forEach((socketId) => {
            this.io.to(socketId).emit('callTimeout', {
              status: CALL_STATUS.ENDED,
              reason: 'Missed call',
            });
          });
        }
      }
    }, this.CALL_TIMEOUT);

    this.activeCallMap.set(callerEmail, {
      receiverEmail,
      status: CALL_STATUS.CALLING,
      startTime: new Date(),
      timeoutId,
    });
    return true;
  }

  endCall(callerEmail, reason = '') {
    const call = this.activeCallMap.get(callerEmail);
    if (call) {
      if (call.timeoutId) {
        clearTimeout(call.timeoutId);
      }

      call.status = CALL_STATUS.ENDED;
      call.endTime = new Date();
      call.reason = reason;
      setTimeout(() => this.activeCallMap.delete(callerEmail), 5000);
    }
    return call;
  }

  cleanupCalls(email) {
    const call = this.activeCallMap.get(email);
    if (call?.timeoutId) {
      clearTimeout(call.timeoutId);
    }
    this.endCall(email, 'User disconnected');

    for (const [callerEmail, call] of this.activeCallMap.entries()) {
      if (call.receiverEmail === email) {
        if (call.timeoutId) {
          clearTimeout(call.timeoutId);
        }
        this.endCall(callerEmail, 'Receiver disconnected');
      }
    }
  }
}

const initializeSocket = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: 'https://192.168.0.102:5174',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  const webRTCService = new WebRTCService(io);
  const callManager = new CallManager(io);

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.emit('socketID', socket.id);
    socket.emit('onlineUsers', callManager.getOnlineUsers());

    // User Login Handler
    socket.on('userLogin', ({ email, name, avatar }) => {
      if (!email) return;
      console.log('User logged in:', email);
      const onlineUsers = callManager.addUserSocket(
        email,
        socket.id,
        name,
        avatar
      );
      io.emit('onlineUsers', onlineUsers);
    });

    // Call Initiation Handler
    socket.on('initiateCall', ({ callerEmail, receiverEmail }) => {
      console.log('Call initiated:', callerEmail, '->', receiverEmail);

      const receiverInfo = callManager.getUserInfo(receiverEmail);
      const callerInfo = callManager.getUserInfo(callerEmail);

      if (!receiverInfo || receiverInfo.sockets.length === 0) {
        socket.emit('callError', { message: 'User is offline' });
        return;
      }

      if (!callManager.createCall(callerEmail, receiverEmail)) {
        socket.emit('callError', {
          message: 'One of the users is in another call',
        });
        return;
      }

      receiverInfo.sockets.forEach((socketId) => {
        io.to(socketId).emit('incomingCall', {
          callerEmail,
          callerName: callerInfo.name,
          callerAvatar: callerInfo.avatar,
        });
      });

      callerInfo.sockets.forEach((socketId) => {
        io.to(socketId).emit('callStatus', {
          status: CALL_STATUS.CALLING,
          receiverEmail,
          receiverName: receiverInfo.name,
        });
      });
    });

    // Call Response Handler
    socket.on('callResponse', ({ callerEmail, receiverEmail, accepted }) => {
      console.log(
        'Call response:',
        callerEmail,
        accepted ? 'accepted' : 'rejected'
      );

      const callerInfo = callManager.getUserInfo(callerEmail);
      const receiverInfo = callManager.getUserInfo(receiverEmail);
      const call = callManager.activeCallMap.get(callerEmail);

      if (call?.timeoutId) {
        clearTimeout(call.timeoutId);
      }

      if (!accepted) {
        callManager.endCall(callerEmail, 'Call rejected');
        callerInfo?.sockets.forEach((socketId) => {
          io.to(socketId).emit('callRejected', {
            receiverEmail,
            receiverName: receiverInfo?.name,
            reason: 'Call rejected by receiver',
          });
        });
      } else {
        // Generate unique room ID using both participants' socket IDs
        const roomId = `p2p_${callerInfo.sockets[0]}_${receiverInfo.sockets[0]}`;
        const redirectUrl = `https://192.168.0.102:5174/video_call/personal/${roomId}`;

        // Update call status to connected
        call.status = CALL_STATUS.CONNECTED;
        call.roomId = roomId;

        callerInfo?.sockets.forEach((socketId) => {
          io.to(socketId).emit('callAccepted', {
            redirectUrl,
            roomId,
            status: CALL_STATUS.CONNECTED,
          });
        });

        receiverInfo?.sockets.forEach((socketId) => {
          io.to(socketId).emit('callAccepted', {
            redirectUrl,
            roomId,
            status: CALL_STATUS.CONNECTED,
          });
        });
      }
    });

    // Call Cancellation Handler
    socket.on('cancelCall', ({ callerEmail, receiverEmail }) => {
      console.log('Call cancelled:', callerEmail);

      const receiverInfo = callManager.getUserInfo(receiverEmail);
      callManager.endCall(callerEmail, 'Call cancelled by caller');

      receiverInfo?.sockets.forEach((socketId) => {
        io.to(socketId).emit('callCancelled', {
          reason: 'Caller cancelled the call',
        });
      });
    });

    // WebRTC Room Handlers
    socket.on('join:room', (roomId) => {
      console.log(`Socket ${socket.id} joining room ${roomId}`);
      const participants = webRTCService.handleJoinRoom(socket, roomId);

      // If we have the full room, update call status
      if (participants.length === 2) {
        // Find the call that matches this room
        for (const [callerEmail, call] of callManager.activeCallMap.entries()) {
          if (call.roomId === roomId) {
            call.status = CALL_STATUS.CONNECTED;
            break;
          }
        }
      }
    });

    socket.on('leave:room', (roomId) => {
      console.log(`Socket ${socket.id} leaving room ${roomId}`);
      webRTCService.handleLeaveRoom(socket, roomId);

      // End any associated calls
      for (const [callerEmail, call] of callManager.activeCallMap.entries()) {
        if (call.roomId === roomId) {
          callManager.endCall(callerEmail, 'Call ended - participant left');
          break;
        }
      }
    });

    // WebRTC Signaling Handler
    socket.on('signal', (data) => {
      console.log(`Signaling from ${socket.id} to ${data.to}`);
      webRTCService.handleSignal(socket, data);
    });

    socket.on('typing', ({ senderEmail, receiverEmail, isTyping }) => {
      console.log(
        `User ${senderEmail} is ${isTyping ? 'typing to' : 'stopped typing to'} ${receiverEmail}`
      );

      const receiverInfo = callManager.getUserInfo(receiverEmail);

      // Notify receiver about typing status
      if (receiverInfo) {
        const senderInfo = callManager.getUserInfo(senderEmail);
        receiverInfo.sockets.forEach((socketId) => {
          io.to(socketId).emit('userTyping', {
            senderEmail,
            senderName: senderInfo?.name || senderEmail,
            isTyping,
          });
        });
      }
    });
    socket.on(
      'new:message',
      ({ conversationId, senderEmail, receiverEmail, message }) => {
        console.log('New message received:', {
          conversationId,
          senderEmail,
          receiverEmail,
        });
    
        const receiverInfo = callManager.getUserInfo(receiverEmail);
        const senderInfo = callManager.getUserInfo(senderEmail);
    
        // Notify both receiver and sender about the new message
        const notifyUser = (userInfo) => {
          if (userInfo) {
            userInfo.sockets.forEach((socketId) => {
              io.to(socketId).emit('message:received', {
                conversationId,
                message,
                shouldReloadConversations: true
              });
            });
          }
        };
    
        // Notify both parties to ensure all instances stay in sync
        notifyUser(receiverInfo);
        notifyUser(senderInfo);
      }
    );
    // Disconnect Handler
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      const { disconnectedEmail, remainingSockets } =
        callManager.removeUserSocket(socket.id);

      // Leave any WebRTC rooms
      for (const [roomId, room] of webRTCService.rooms.entries()) {
        if (room.participants.has(socket.id)) {
          webRTCService.handleLeaveRoom(socket, roomId);
        }
      }

      if (disconnectedEmail && remainingSockets.length === 0) {
        io.emit('onlineUsers', callManager.getOnlineUsers());
      }
    });
  });

  return io;
};

module.exports = initializeSocket;
