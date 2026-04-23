// src/server.ts

import express from "express";
import http from "http";
import { Server } from "socket.io";
import { handleConnection } from "./controllers/gameController";
import type { ClientToServerEvents, ServerToClientEvents } from "./types/types";

// Basic setup
const app = express();
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",  // Allow all origins for testing
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["Content-Type"]
  },
  transports: ['websocket', 'polling'],  // Critical for some networks
  allowEIO3: true  // Compatibility
});

app.use(express.static("public"));

io.on("connection", (socket) => handleConnection(socket, io));

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
