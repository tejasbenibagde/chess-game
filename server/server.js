const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { handleConnection } = require("./controllers/gameController");

// Basic setup
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(express.static("public"));

io.on("connection", (socket) => handleConnection(socket, io));

server.listen(3000, () => {
  console.log("Listening on *:3000");
});
