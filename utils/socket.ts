import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initSocket = (deviceToken: string, role: string, token?: string): Socket => {
  if (!socket) {
    socket = io('http://localhost:3000', {
      auth: {
        token: token || null,
        deviceToken: deviceToken,
        role,
      },
      autoConnect: false,
    });
  }

  socket.auth = {
    token: token || null,
    deviceToken: deviceToken,
    role,
  };

  socket.connect();

  console.log('Connection status:', socket.connected);

  socket.on('connect', () => {
    console.log('✅ Socket connected');
  });

  socket.on('disconnect', () => {
    console.log('❌ Socket disconnected');
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  socket?.disconnect();
  socket = null;
};

export const reconnectSocket = (newAuth: {
  token: string;
  deviceToken: string;
  role: string;
}): Socket => {
  if (!socket) {
    socket = initSocket(newAuth.deviceToken, newAuth.role, newAuth.token);
    return socket;
  }

  socket.auth = {
    token: newAuth.token,
    deviceToken: newAuth.deviceToken,
    role: newAuth.role,
  };

  socket.disconnect();
  socket.connect();

  return socket;
};