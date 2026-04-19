// src/controllers/gameController.ts

import type { TypedSocket, TypedServer, ChessMove } from "../types/types";
import { addWaitingUser, assignRoom, findRoomBySocketId, handleDisconnection } from "../utils/roomManager";

function handleConnection(
  socket: TypedSocket,
  io: TypedServer
): void {
  console.log("A user connected", socket.id);

  addWaitingUser(socket);

  if (!assignRoom(io)) {
    // Notify the user to wait for an opponent if no room is assigned
    socket.emit("waitingForOpponent", {
      message: "Waiting for an opponent to join...",
    });
  }

  socket.on("move", (move: ChessMove) => handleMove(socket, move, io));
  socket.on("chatMessage", (message: string) => handleChatMessage(socket, message, io)); // Handle chat messages
  socket.on("disconnect", () => handleDisconnection(socket, io));
}

function handleMove(
  socket: TypedSocket,
  move: ChessMove,
  io: TypedServer
): void {
  console.log("Move received:", move);

  const roomName = findRoomBySocketId(socket.id);
  console.log("Room name:", roomName);

  if (roomName) {
    socket.to(roomName).emit("move", move);
  } else {
    console.log("No room found for move:", move);
  }
}

function handleChatMessage(
  socket: TypedSocket,
  message: string,
  io: TypedServer
): void {
  const roomName = findRoomBySocketId(socket.id);
  if (roomName) {
    io.to(roomName).emit("chatMessage", message);
  }
}

export { handleConnection };
