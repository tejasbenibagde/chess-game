import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export function useGameSocket(roomId: string, onMove: (move: any) => void, onChat: (msg: string) => void) {
  const [socket, setSocket] = useState<any>(null);
  const [role, setRole] = useState<'w' | 'b'>('w');
  const [gameStarted, setGameStarted] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
    const newSocket = io(API_URL, { transports: ['websocket'] });
    
    newSocket.on('connect', () => {
      console.log('Connected to server');
    });
    
    newSocket.on('userrole', ({ role: userRole }: { role: 'w' | 'b' }) => {
      setRole(userRole);
    });
    
    newSocket.on('startGame', ({ message }: { message: string }) => {
      setGameStarted(true);
      setStatus('Game started! Good luck!');
    });
    
    newSocket.on('move', (move: any) => {
      onMove(move);
    });
    
    newSocket.on('chatMessage', (msg: string) => {
      onChat(msg);
    });
    
    newSocket.on('waitingForOpponent', ({ message }: { message: string }) => {
      setStatus(message);
      setGameStarted(false);
    });
    
    setSocket(newSocket);
    
    return () => {
      newSocket.disconnect();
    };
  }, [roomId]);

  const joinGame = (playerName: string) => {
    if (socket && playerName.trim()) {
      socket.emit('join-game', roomId, playerName);
      return true;
    }
    return false;
  };

  const sendMove = (move: any) => {
    if (socket && gameStarted) {
      socket.emit('move', move);
    }
  };

  const sendChat = (playerName: string, message: string) => {
    if (socket && message.trim()) {
      socket.emit('chatMessage', `${playerName}: ${message}`);
    }
  };

  return {
    socket,
    role,
    gameStarted,
    status,
    setStatus,
    joinGame,
    sendMove,
    sendChat,
  };
}