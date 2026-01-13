import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import { store } from '../store/store';
import { addNotification } from '../store/slices/notificationSlice';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'https://gigflow-ops0.onrender.com';
let socket = null;

export const initSocket = (userId) => {
  if (socket) return socket;

  socket = io(SOCKET_URL, {
    withCredentials: true
  });

  socket.on('connect', () => {
    console.log('Socket connected');
    socket.emit('join', userId);
  });

  socket.on('hired', (data) => {
    console.log('Hired notification:', data);
    
    store.dispatch(addNotification({
      type: 'hired',
      message: data.message,
      gigId: data.gigId,
      gigTitle: data.gigTitle
    }));

    toast.success(data.message, {
      duration: 6000,
      style: {
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        color: '#ffffff',
        padding: '20px',
        borderRadius: '16px',
        boxShadow: '0 20px 25px -5px rgba(16, 185, 129, 0.3), 0 8px 10px -6px rgba(16, 185, 129, 0.2)',
        minWidth: '400px',
        fontSize: '16px',
        fontWeight: '600',
      },
    });
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
