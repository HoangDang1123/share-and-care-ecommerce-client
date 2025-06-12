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

export const reconnectSocket = (): Socket => {
  const token = localStorage.getItem('accessToken') || '';
  const deviceToken = localStorage.getItem('deviceToken') || '';

  if (socket) {
    socket.disconnect();
    socket = null;
  }

  const newSocket = initSocket(deviceToken, "user", token);
  socket = newSocket;

  return socket;
};