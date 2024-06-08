// main.js
import { Chess } from "chess.js";
import { io } from "socket.io-client"; // Adjusted the import

let board = null;
const game = new Chess();
let currentPlayer = "";
const $status = $("#status");
const $fen = $("#fen");
const $pgn = $("#pgn");

// This line connects client-side sockets to server-side sockets
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
  // do not pick up pieces if the game is over
  if (game.isGameOver()) return false;

  // check if it's the current player's turn to move
  if (
    (currentPlayer === "w" && piece.search(/^b/) !== -1) || // if it's white player's turn and piece is black
    (currentPlayer === "b" && piece.search(/^w/) !== -1) // if it's black player's turn and piece is white
  ) {
    return false;
  }
}

function onDrop(source, target) {
  // see if the move is legal
  try {
    const move = game.move({
      from: source,
      to: target,
      promotion: "q", // NOTE: always promote to a queen for example simplicity
    });

    // illegal move
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

  // checkmate?
  if (game.isCheckmate()) {
    status = "Game over, " + moveColor + " is in checkmate.";
    const notifier = document.getElementById("notifier");
    if (game.turn() !== currentPlayer) {
      notifier.style.opacity = "100%";
      notifier.innerHTML = "Congratulations, You Won!";
    } else {
      notifier.style.opacity = "100%";
      notifier.innerHTML = "Game Over you lost";
    }
  } else if (game.isDraw()) {
    // draw?
    status = "Game over, drawn position";
  } else {
    // game still on
    status = moveColor + " to move";

    // check?
    if (game.isCheck()) {
      status += ", " + moveColor + " is in check";
    }
  }

  $status.html(status);
  $fen.html(game.fen());
  $pgn.html(game.pgn());
}

// update the board position after the piece snap
// for castling, en passant, pawn promotion
function onSnapEnd() {
  board.position(game.fen());
}

socket.on("userrole", function ({ role }) {
  console.log(role);
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
    pieceTheme: "/pieces/type2/{piece}.png",
    dropOffBoard: "snapback",
    orientation: currentPlayer === "w" ? "white" : "black",
  };

  board = Chessboard("board", config);
  updateStatus();
});

socket.on("waitingForOpponent", ({ message }) => {
  console.log(message);
  const playerRole = document.querySelector("#role");
  playerRole.innerHTML = message;
});

// Listen for moves from the opponent
socket.on("move", (move) => {
  game.move(move);
  board.position(game.fen());
  updateStatus();
});
