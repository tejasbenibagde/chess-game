import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useState, useMemo } from 'react';
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
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
        setErrorMessage(null);
      }
      return;
    }
    
    // Attempt to make a move
    const isValidMove = validMoves.includes(square);
    
    if (isValidMove) {
      onMove({ from: selectedSquare, to: square, promotion: 'q' });
      setSelectedSquare(null);
      setValidMoves([]);
      setErrorMessage(null);
    } else {
      // Invalid move - show feedback and clear selection
      setErrorMessage('Invalid move!');
      setSelectedSquare(null);
      setValidMoves([]);
      
      // Clear error message after 2 seconds
      setTimeout(() => setErrorMessage(null), 2000);
    }
  };

  const isHighlightedSquare = (square: string) => {
    return selectedSquare === square;
  };

  const isValidMoveSquare = (square: string) => {
    return validMoves.includes(square);
  };

  return (
    <View style={{ width: boardSize, height: boardSize }} className="flex-row flex-wrap relative">
      {/* Error toast */}
      {errorMessage && (
        <View className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-red-500 px-4 py-2 rounded-full">
          <Text className="text-white font-semibold text-sm">{errorMessage}</Text>
        </View>
      )}
      
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
                isSelected && "border-4 border-yellow-400 rounded-sm",
                isValidMove && "relative"
              )}
              onPress={() => handleSquarePress(square)}
            >
              {/* Valid move indicator */}
              {isValidMove && (
                <View className={cn(
                  "absolute w-6 h-6 rounded-full",
                  piece ? "bg-red-500/50" : "bg-green-500/30"
                )} />
              )}
              
              {/* Chess piece */}
              {pieceImage && (
                <Image 
                  source={pieceImage} 
                  className="w-4/5 h-4/5"
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