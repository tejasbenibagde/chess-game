// server/src/types.ts
import type { Socket, Server } from 'socket.io';

// ============ Chess Types ============
export type PieceColor = 'w' | 'b';
export type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';

export interface ChessMove {
  color: PieceColor;
  piece: PieceType;
  from: string;
  to: string;
  san: string;
  flags: string;
  lan: string;
  before: string;
  after: string;
  captured?: PieceType;
  promotion?: PieceType;
}

// ============ Socket Event Types ============
export interface ClientToServerEvents {
  move: (move: ChessMove) => void;
  chatMessage: (message: string) => void;
}

export interface ServerToClientEvents {
  move: (move: ChessMove) => void;
  chatMessage: (message: string) => void;
  waitingForOpponent: (data: { message: string }) => void;
  userrole: (data: { role: PieceColor; room: string }) => void;
  startGame: (data: { message: string; room: string }) => void;
}

// ============ Room Types ============
export interface Room {
  id: string;
  players: string[]; // socket ids
}

// ============ Helper Types ============
export type TypedSocket = Socket<ClientToServerEvents, ServerToClientEvents>;
export type TypedServer = Server<ClientToServerEvents, ServerToClientEvents>;