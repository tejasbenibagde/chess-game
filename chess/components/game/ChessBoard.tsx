import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

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

interface ChessBoardProps {
  game: any;
  role: 'w' | 'b';
  onMove: (move: { from: string; to: string; promotion?: string }) => void;
  boardSize: number;
}

export function ChessBoard({ game, role, onMove, boardSize }: ChessBoardProps) {
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [validMoves, setValidMoves] = useState<string[]>([]);
  
  const board = game.board();
  
  const displayFiles = role === 'w' ? files : [...files].reverse();
  const displayRanks = role === 'w' ? ranks : [...ranks].reverse();

  const getPieceImageSource = (piece: any) => {
    if (!piece) return null;
    const key = `${piece.color === 'w' ? 'w' : 'b'}${piece.type.toUpperCase()}` as keyof typeof pieceImages;
    return pieceImages[key];
  };

  // Calculate valid moves for selected piece
  const calculateValidMoves = (square: string) => {
    try {
      const moves = game.moves({
        verbose: true,
        square: square,
      });
      return moves.map((move: any) => move.to);
    } catch (e) {
      console.log('Error calculating moves:', e);
      return [];
    }
  };

  const handleSquarePress = (square: string) => {
    const piece = game.get(square);
    
    // Not your turn
    if (game.turn() !== role) return;
    
    // No piece selected yet
    if (!selectedSquare) {
      // Select a piece (must be your own piece)
      if (piece && piece.color === role) {
        setSelectedSquare(square);
        setValidMoves(calculateValidMoves(square));
      }
      return;
    }
    
    // Attempt to make a move
    const isValidMove = validMoves.includes(square);
    
    if (isValidMove) {
      onMove({ from: selectedSquare, to: square, promotion: 'q' });
      setSelectedSquare(null);
      setValidMoves([]);
    } else {
      // Invalid move - clear selection and let the player try again
      setSelectedSquare(null);
      setValidMoves([]);
    }
  };

  const isHighlightedSquare = (square: string) => {
    return selectedSquare === square;
  };

  const isValidMoveSquare = (square: string) => {
    return validMoves.includes(square);
  };

  // Calculate sizes based on board size
  const squareSize = boardSize / 8;
  const dotSize = squareSize * 0.25;
  const pieceSize = squareSize * 0.7;

  return (
    <View style={{ width: boardSize, height: boardSize }} className="flex-row flex-wrap relative">
      {displayRanks.map((rank, rIdx) =>
        displayFiles.map((file, fIdx) => {
          const square = file + rank;
          const realRankIndex = ranks.indexOf(rank);
          const realFileIndex = files.indexOf(file);
          const piece = board[realRankIndex]?.[realFileIndex];
          const isDark = (rIdx + fIdx) % 2 === 1;
          const isSelected = isHighlightedSquare(square);
          const isValidMove = isValidMoveSquare(square);
          const pieceImage = piece ? getPieceImageSource(piece) : null;
          
          return (
            <TouchableOpacity
              key={square}
              className={cn(
                "w-[12.5%] h-[12.5%] justify-center items-center",
                isDark ? "bg-[#769656]" : "bg-[#eeeed2]",
                isSelected && "border-4 border-yellow-400 rounded-sm"
              )}
              onPress={() => handleSquarePress(square)}
            >
              {/* Valid move indicator */}
              {isValidMove && (
                <View 
                  className={cn(
                    "absolute rounded-full",
                    piece ? "bg-red-500/60" : "bg-green-500/40"
                  )}
                  style={{ width: dotSize, height: dotSize }}
                />
              )}
              
              {/* Chess piece - NO className, only style */}
              {pieceImage && (
                <Image 
                  source={pieceImage} 
                  style={{ 
                    width: pieceSize,
                    height: pieceSize
                  }}
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