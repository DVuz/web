class WebRTCService {
  constructor(io) {
    this.io = io;
    this.rooms = new Map(); // roomId -> { participants: Set<socketId>, status: string }
  }

  handleJoinRoom(socket, roomId) {
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, {
        participants: new Set(),
        status: 'waiting',
        created: Date.now(),
      });
    }

    const room = this.rooms.get(roomId);

    // Check if room is full
    if (room.participants.size >= 2) {
      socket.emit('error', { message: 'Room is full' });
      return Array.from(room.participants);
    }

    // Add participant to room
    room.participants.add(socket.id);
    socket.join(roomId);

    // Notify others in room about new participant
    socket.to(roomId).emit('peer:join', {
      peerId: socket.id,
      timestamp: Date.now(),
    });

    // If room is now full (2 participants), trigger connection
    if (room.participants.size === 2) {
      room.status = 'connected';
      this.io.to(roomId).emit('room:ready', {
        participants: Array.from(room.participants),
        timestamp: Date.now(),
      });
    }

    return Array.from(room.participants);
  }

  handleLeaveRoom(socket, roomId) {
    const room = this.rooms.get(roomId);
    if (!room) return;

    // Remove participant from room
    room.participants.delete(socket.id);

    // Notify others about participant leaving
    socket.to(roomId).emit('peer:leave', {
      peerId: socket.id,
      timestamp: Date.now(),
    });

    // Clean up empty rooms
    if (room.participants.size === 0) {
      this.rooms.delete(roomId);
    } else {
      room.status = 'waiting';
    }

    socket.leave(roomId);
  }

  handleSignal(socket, { type, data, to }) {
    if (!to) {
      console.error('Missing "to" field in signal message');
      return;
    }

    // Forward WebRTC signaling data between peers
    socket.to(to).emit('signal', {
      type,
      data,
      from: socket.id,
      timestamp: Date.now(),
    });
  }

  // Clean up inactive rooms
  cleanupInactiveRooms(maxAge = 1800000) {
    // 30 minutes
    const now = Date.now();
    for (const [roomId, room] of this.rooms.entries()) {
      if (now - room.created > maxAge) {
        // Notify participants
        this.io.to(roomId).emit('room:timeout', {
          message: 'Room timed out due to inactivity',
        });

        // Force all participants to leave
        room.participants.forEach((participantId) => {
          const socket = this.io.sockets.sockets.get(participantId);
          if (socket) {
            this.handleLeaveRoom(socket, roomId);
          }
        });

        // Delete the room
        this.rooms.delete(roomId);
      }
    }
  }

  // Get room status
  getRoomStatus(roomId) {
    const room = this.rooms.get(roomId);
    if (!room) return null;

    return {
      participants: Array.from(room.participants),
      status: room.status,
      created: room.created,
    };
  }
}

module.exports = WebRTCService;
