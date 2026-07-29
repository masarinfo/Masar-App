'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { IUserAwareness } from '@masar/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const CURSOR_COLORS = [
  '#10b981', // Emerald
  '#06b6d4', // Cyan
  '#f59e0b', // Amber
  '#ec4899', // Pink
  '#8b5cf6', // Purple
  '#3b82f6', // Blue
];

export function useCollaboration(documentId: string, currentUser?: { id: string; name: string }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [activeUsers, setActiveUsers] = useState<IUserAwareness[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!documentId) return;

    const newSocket = io(`${API_URL}/sync`, {
      transports: ['websocket'],
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      setIsConnected(true);

      const color = CURSOR_COLORS[Math.floor(Math.random() * CURSOR_COLORS.length)];
      const userAwareness: IUserAwareness = {
        id: currentUser?.id || newSocket.id || 'user-guest',
        name: currentUser?.name || 'مستخدم متزامن',
        color,
      };

      newSocket.emit('document:join', { documentId, user: userAwareness });
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    newSocket.on('awareness:update', (users: IUserAwareness[]) => {
      setActiveUsers(users);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [documentId, currentUser?.id, currentUser?.name]);

  return {
    socket,
    isConnected,
    activeUsers,
  };
}
