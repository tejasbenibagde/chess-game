import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useState } from 'react';

const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

// Map piece types to image filenames
const getPieceImage = (piece: any) => {
  if (!piece) return null;
  
  // Format: bK (black King), wQ (white Queen), etc.
  const colorPrefix = piece.color === 'w' ? 'w' : 'b';
  let pieceType = '';
  
  switch (piece.type) {
    case 'k': pieceType = 'K'; break; // King
    case 'q': pieceType = 'Q'; break; // Queen
    case 'r': pieceType = 'R'; break; // Rook
    case 'b': pieceType = 'B'; break; // Bishop
    case 'n': pieceType = 'N'; break; // Knight
    case 'p': pieceType = 'P'; break; // Pawn
    default: return null;
  }
  
  const imageName = `${colorPrefix}${pieceType}`;
  // Using require with dynamic path - you'll need to adjust the path based on your structure
  return imageName;
};

// Alternative: If you want to use require with all pieces pre-imported
const pieceImages = {
  bK: require('@/assets/pieces/type2/bK.png'),
  bQ: require('@/assets/pieces/type2/bQ.png'),
  bR: require('@/assets/pieces/type2/bR.png'),
  bB: require('@/assets/pieces/type2/bB.png'),
  bN: require('@/assets/pieces/type2/bN.png'),
  bP: require('@/assets/pieces/type2/bP.png'),
  wK: require('@/assets/pieces/type2/wK.png'),
  wQ: require('@/assets/pieces/type2/wQ.png'),
  wR: require('@/assets/pieces/type2/wR.png'),
  wB: require('@/assets/pieces/type2/wB.png'),
  wN: require('@/assets/pieces/type2/wN.png'),
  wP: require('@/assets/pieces/type2/wP.png'),
};

export function ChessBoard({ game, role, onMove, boardSize }: any) {
  const [selected, setSelected] = useState<string | null>(null);
  const board = game.board();
  
  const displayFiles = role === 'w' ? files : [...files].reverse();
  const displayRanks = role === 'w' ? ranks : [...ranks].reverse();

  const getPieceImageSource = (piece: any) => {
    if (!piece) return null;
    
    const colorPrefix = piece.color === 'w' ? 'w' : 'b';
    let pieceType = '';
    
    switch (piece.type) {
      case 'k': pieceType = 'K'; break;
      case 'q': pieceType = 'Q'; break;
      case 'r': pieceType = 'R'; break;
      case 'b': pieceType = 'B'; break;
      case 'n': pieceType = 'N'; break;
      case 'p': pieceType = 'P'; break;
      default: return null;
    }
    
    const key = `${colorPrefix}${pieceType}` as keyof typeof pieceImages;
    return pieceImages[key];
  };

  const handlePress = (square: string) => {
    const piece = game.get(square);
    
    if (game.turn() !== role) return;
    
    if (!selected) {
      if (!piece || piece.color !== role) return;
      setSelected(square);
      return;
    }
    
    onMove({ from: selected, to: square, promotion: 'q' });
    setSelected(null);
  };

  return (
    <View style={{ width: boardSize, height: boardSize, flexDirection: 'row', flexWrap: 'wrap' }}>
      {displayRanks.map((rank, rIdx) =>
        displayFiles.map((file, fIdx) => {
          const square = file + rank;
          const realRankIndex = ranks.indexOf(rank);
          const realFileIndex = files.indexOf(file);
          const piece = board[realRankIndex]?.[realFileIndex];
          const isDark = (rIdx + fIdx) % 2 === 1;
          const pieceImage = piece ? getPieceImageSource(piece) : null;
          
          return (
            <TouchableOpacity
              key={square}
              style={[
                styles.square,
                { backgroundColor: isDark ? '#769656' : '#eeeed2' },
                selected === square && styles.selected,
              ]}
              onPress={() => handlePress(square)}
            >
              {pieceImage && (
                <Image 
                  source={pieceImage} 
                  style={styles.pieceImage}
                  resizeMode="contain"
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
  square: {
    width: '12.5%',
    height: '12.5%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selected: {
    borderWidth: 3,
    borderColor: '#ffeb3b',
    borderRadius: 4,
  },
  pieceImage: {
    width: '80%',
    height: '80%',
  },
});