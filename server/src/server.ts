import express from "express";
import http from "http";
import { Server } from "socket.io";
import { handleConnection } from "./controllers/gameController";
import type { ClientToServerEvents, ServerToClientEvents } from "./types/types";

// Basic setup
const app = express();
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

// Health check endpoints (BEFORE Socket.io)
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "Chess server is running",
    timestamp: new Date().toISOString(),
    port: PORT,
    websocket: "Socket.io ready"
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    connections: io?.engine?.clientsCount || 0
  });
});

app.get("/ping", (req, res) => {
  res.send("pong");
});

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["Content-Type"]
  },
  transports: ['websocket', 'polling'],
  allowEIO3: true
});

app.use(express.static("public"));

// Socket connection handling
io.on("connection", (socket) => {
  console.log(`🔌 New connection: ${socket.id}`);
  handleConnection(socket, io);
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`📍 WebSocket ready: ws://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});