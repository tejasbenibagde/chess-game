// src/utils/roomManager.ts

import type { TypedSocket, TypedServer, PieceColor } from "../types/types";

let waitingUsers: TypedSocket[] = [];
let roomCounter = 1;
const rooms: Record<string, string[]> = {};

function addWaitingUser(socket: TypedSocket) {
  waitingUsers.push(socket);
}

function assignRoom(io: TypedServer): boolean {
  if (waitingUsers.length >= 2) {
    const player1 = waitingUsers.shift();
    const player2 = waitingUsers.shift();
    // Extra safety (TS doesn't guarantee shift returns value)
    if (!player1 || !player2) return false;

    const roomName = `room${roomCounter++}`;

    player1.join(roomName);
    player2.join(roomName);

    rooms[roomName] = [player1.id, player2.id];


    player1.emit("userrole", { role: "w" as PieceColor, room: roomName });
    player2.emit("userrole", { role: "b" as PieceColor, room: roomName });

    io.to(roomName).emit("startGame", {
      message: "Game started",
      room: roomName,
    });

    console.log(`Game started in ${roomName}`);
    return true;
  }
  return false;
}

function findRoomBySocketId(socketId: string): string | null {
  for (const room in rooms) {
    if (!rooms[room]) continue; // Extra safety check
    if (rooms[room].includes(socketId)) {
      return room;
    }
  }
  return null;
}

function handleDisconnection(
  socket: TypedSocket,
  io: TypedServer
) {
  console.log("User disconnected", socket.id);

  waitingUsers = waitingUsers.filter((user) => user.id !== socket.id);
  for (const room in rooms) {
    if (!rooms[room]) continue;
    if (rooms[room].includes(socket.id)) {
      rooms[room] = rooms[room].filter((id) => id !== socket.id);

      if (rooms[room].length === 0) {
        delete rooms[room];
      }
    }
  }
}

export {
  addWaitingUser,
  assignRoom,
  findRoomBySocketId,
  handleDisconnection,
};
