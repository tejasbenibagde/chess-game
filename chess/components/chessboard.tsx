import { View, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useState } from "react";
import { Chess, Square } from "chess.js";

type Props = {
  game: Chess;
  role: "w" | "b";
  onMove: (move: { from: string; to: string; promotion?: string }) => void;
};

const baseFiles = ["a", "b", "c", "d", "e", "f", "g", "h"];
const baseRanks = ["8", "7", "6", "5", "4", "3", "2", "1"];

const pieceMap: Record<string, any> = {
  p: require("../assets/pieces/bP.png"),
  r: require("../assets/pieces/bR.png"),
  n: require("../assets/pieces/bN.png"),
  b: require("../assets/pieces/bB.png"),
  q: require("../assets/pieces/bQ.png"),
  k: require("../assets/pieces/bK.png"),
  P: require("../assets/pieces/wP.png"),
  R: require("../assets/pieces/wR.png"),
  N: require("../assets/pieces/wN.png"),
  B: require("../assets/pieces/wB.png"),
  Q: require("../assets/pieces/wQ.png"),
  K: require("../assets/pieces/wK.png"),
};

export default function ChessBoard({ game, role, onMove }: Props) {
  const [selected, setSelected] = useState<string | null>(null);

  const board = game.board();

  // Flip only UI, NOT underlying data
  const displayFiles = role === "w" ? baseFiles : [...baseFiles].reverse();
  const displayRanks = role === "w" ? baseRanks : [...baseRanks].reverse();

  const handlePress = (square: Square) => {
    const piece = game.get(square);

    // ❌ Not your turn → ignore
    if (game.turn() !== role) return;

    // FIRST CLICK → select piece
    if (!selected) {
      if (!piece || piece.color !== role) return;
      setSelected(square);
      return;
    }

    // SECOND CLICK → attempt move
    onMove({
      from: selected,
      to: square,
      promotion: "q",
    });

    setSelected(null);
  };

  return (
    <View style={styles.board}>
      {displayRanks.map((rank, rIdx) =>
        displayFiles.map((file, fIdx) => {
          const square = (file + rank) as Square;

          // ✅ Correct indexing (always from original board)
          const realRankIndex = baseRanks.indexOf(rank);
          const realFileIndex = baseFiles.indexOf(file);

          const piece = board[realRankIndex][realFileIndex];
          const isDark = (rIdx + fIdx) % 2 === 1;

          return (
            <TouchableOpacity
              key={square}
              style={[
                styles.square,
                { backgroundColor: isDark ? "#769656" : "#eeeed2" },
                selected === square && styles.selected,
              ]}
              onPress={() => handlePress(square)}
            >
              {piece && (
                <Image
                  source={
                    pieceMap[
                      piece.color === "w"
                        ? piece.type.toUpperCase()
                        : piece.type
                    ]
                  }
                  style={styles.piece}
                />
              )}
            </TouchableOpacity>
          );
        })
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    width: "100%",
    aspectRatio: 1, 
    flexDirection: "row",
    flexWrap: "wrap",
  },
  square: {
    width: "12.5%",
    height: "12.5%",
    justifyContent: "center",
    alignItems: "center",
  },
  piece: {
    width: "80%",
    height: "80%",
    resizeMode: "contain",
  },
  selected: {
    borderWidth: 2,
    borderColor: "red",
  },
});