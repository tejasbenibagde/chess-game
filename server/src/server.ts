// src/server.ts

import express from "express";
import http from "http";
import { Server } from "socket.io";
import { handleConnection } from "./controllers/gameController";
import type { ClientToServerEvents, ServerToClientEvents } from "./types/types";

// Basic setup
const app = express();
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

server.listen(3000, () => {
  console.log("Listening on *:3000");
});
