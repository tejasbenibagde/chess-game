import { View, Text, Dimensions, Animated, ScrollView } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { Chess } from 'chess.js';
import { ChessBoard } from '@/components/game/ChessBoard';
import { ChatDrawer } from '@/components/game/ChatDrawer';
import { GameOverModal } from '@/components/game/GameOverModal';
import { GameHeader } from '@/components/game/GameHeader';
import { WaitingScreen } from '@/components/game/WaitingScreen';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useGameSocket } from '@/hooks/useGameSocket';

const { width, height } = Dimensions.get('window');
const boardSize = Math.min(width - 40, 380);

export default function GameScreen() {
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const [game] = useState(() => new Chess());
  const [playerName] = useState('Player');
  const [hasJoined, setHasJoined] = useState(false);
  const [chatVisible, setChatVisible] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [chatMessages, setChatMessages] = useState<string[]>([]);
  const [messageText, setMessageText] = useState('');
  const [showGameOver, setShowGameOver] = useState(false);
  const [gameResult, setGameResult] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const slideAnim = useRef(new Animated.Value(height)).current;

  // Force a re-render when game state changes
  const [, forceUpdate] = useState({});

  const refreshBoard = () => {
    forceUpdate({});
    updateGameStatus();
  };

  const showError = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(null), 2000);
  };

  const handleMove = (move: any) => {
    try {
      const result = game.move(move);
      if (result) {
        refreshBoard();
      } else {
        showError('Invalid move attempted');
      }
    } catch (e: any) {
      console.log('Invalid move:', e);
      showError(e.message || 'Invalid move!');
      // Don't refresh board on error
    }
  };

  const handleChat = (msg: string) => {
    setChatMessages(prev => [...prev, msg]);
    if (!chatVisible) setUnreadCount(prev => prev + 1);
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const { socket, role, gameStarted, status, setStatus, joinGame, sendMove, sendChat } = useGameSocket(
    roomId,
    handleMove,
    handleChat
  );

  const { colors } = useAppTheme();

  useEffect(() => {
    if (socket && !hasJoined) {
      if (joinGame(playerName)) {
        setHasJoined(true);
      }
    }
  }, [socket, hasJoined, joinGame, playerName]);

  const updateGameStatus = () => {
    if (game.isCheckmate()) {
      const winner = game.turn() === 'w' ? 'Black' : 'White';
      setGameResult(`${winner} wins by checkmate!`);
      setShowGameOver(true);
    } else if (game.isStalemate()) {
      setGameResult('Game drawn by stalemate');
      setShowGameOver(true);
    } else if (game.isThreefoldRepetition()) {
      setGameResult('Game drawn by repetition');
      setShowGameOver(true);
    }
  };

  const onMove = (move: any) => {
    try {
      const result = game.move(move);
      if (result) {
        sendMove(result);
        refreshBoard();
      } else {
        showError('Invalid move!');
      }
    } catch (e: any) {
      console.log('Invalid move error:', e);
      showError(e.message || 'Cannot move there!');
    }
  };

  const onSendChat = () => {
    if (messageText.trim()) {
      sendChat(playerName, messageText);
      setChatMessages(prev => [...prev, `You: ${messageText}`]);
      setMessageText('');
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  const showChatDrawer = () => {
    setChatVisible(true);
    setUnreadCount(0);
    Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, tension: 65, friction: 11 }).start();
  };

  const hideChatDrawer = () => {
    Animated.timing(slideAnim, { toValue: height, duration: 250, useNativeDriver: true })
      .start(() => setChatVisible(false));
  };

  const handleExit = () => {
    setShowGameOver(false);
    game.reset();
    router.back();
  };

  const handleRematch = () => {
    setShowGameOver(false);
    game.reset();
    refreshBoard();
    router.replace(`/game/${roomId}`);
  };

  // Screen states
  if (!gameStarted) {
    return <WaitingScreen roomId={roomId} playerName={playerName} status={status} />;
  }

  return (
    <View style={{ backgroundColor: colors.background }} className="flex-1">
      <GameHeader
        role={role}
        playerName={playerName}
        unreadCount={unreadCount}
        onChatPress={showChatDrawer}
        onExitPress={handleExit}
      />

      <View className="items-center my-2.5">
        <ChessBoard 
          game={game} 
          role={role} 
          onMove={onMove} 
          boardSize={boardSize} 
        />
      </View>

      <View
        className="rounded-lg p-3 mx-5 my-2.5"
        style={{ backgroundColor: colors.muted }}
      >
        <Text className="text-sm text-center font-medium" style={{ color: colors.foreground }}>
          {status}
        </Text>
      </View>

      {/* Global error message */}
      {errorMessage && (
        <View className="absolute bottom-20 left-5 right-5 bg-red-500 rounded-lg p-3">
          <Text className="text-white text-center font-medium">{errorMessage}</Text>
        </View>
      )}

      <ChatDrawer
        ref={scrollViewRef}
        visible={chatVisible}
        messages={chatMessages}
        messageText={messageText}
        onMessageChange={setMessageText}
        onSend={onSendChat}
        onClose={hideChatDrawer}
        slideAnim={slideAnim}
      />

      <GameOverModal visible={showGameOver} result={gameResult} onRematch={handleRematch} onExit={handleExit} />
    </View>
  );
}