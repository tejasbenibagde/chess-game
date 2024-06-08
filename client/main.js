import { Chess } from "chess.js";
import { io } from "socket.io-client";

let board = null;
const game = new Chess();
let currentPlayer = "";
const $status = $("#status");
const $fen = $("#fen");
const $pgn = $("#pgn");

const socket = io("http://localhost:3000");

// Override addEventListener to always set passive to false
(function () {
  const originalAddEventListener = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function (type, listener, options) {
    if (typeof options === "object") {
      options.passive = false;
    } else {
      options = { capture: options, passive: false };
    }
    originalAddEventListener.call(this, type, listener, options);
  };
})();

function onDragStart(source, piece, position, orientation) {
  if (game.isGameOver()) return false;

  if (
    (game.turn() === "w" && piece.search(/^b/) !== -1) ||
    (game.turn() === "b" && piece.search(/^w/) !== -1)
  ) {
    return false;
  }
}

function onDrop(source, target) {
  try {
    const move = game.move({
      from: source,
      to: target,
      promotion: "q",
    });
  
    if (move === null) return "snapback";
  
    socket.emit("move", move);
  
    updateStatus();
  } catch (error) {
    return "snapback";
  }
}

function updateStatus() {
  let status = "";

  const moveColor = game.turn() === "b" ? "Black" : "White";

  if (game.isCheckmate()) {
    status = "Game over, " + moveColor + " is in checkmate.";
  } else if (game.isDraw()) {
    status = "Game over, drawn position";
  } else {
    status = moveColor + " to move";

    if (game.isCheck()) {
      status += ", " + moveColor + " is in check";
    }
  }

  $status.html(status);
  $fen.html(game.fen());
  $pgn.html(game.pgn());
}

function onSnapEnd() {
  board.position(game.fen());
}

socket.on("userrole", function ({ role }) {
  currentPlayer = role;
  const playerRole = document.querySelector("#role");
  playerRole.innerHTML = role;

  const config = {
    position: "start",
    draggable: true,
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd,
    moveSpeed: "slow",
    snapbackSpeed: 500,
    snapSpeed: 100,
    pieceTheme: "/pieces/type1/{piece}.png",
    dropOffBoard: "snapback",
    orientation: currentPlayer === "w" ? "white" : "black",
  };

  board = Chessboard("board", config);
  updateStatus();
});

socket.on("waitingForOpponent", ({ message }) => {
  const playerRole = document.querySelector("#role");
  playerRole.innerHTML = message;
});

socket.on("move", (move) => {
  game.move(move);
  board.position(game.fen());
  updateStatus();
});

// Chat feature
document.getElementById("sendButton").addEventListener("click", () => {
  const chatInput = document.getElementById("chatInput");
  const message = chatInput.value;
  if (message) {
    socket.emit("chatMessage", message);
    chatInput.value = "";
  }
});

socket.on("chatMessage", (message) => {
  const chatMessages = document.getElementById("chatMessages");
  const messageElement = document.createElement("div");
  messageElement.textContent = message;
  chatMessages.appendChild(messageElement);
});
