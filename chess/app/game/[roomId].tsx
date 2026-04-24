import { View, Text, StyleSheet, Dimensions, Animated, ScrollView } from 'react-native'; // Added ScrollView and Text
import { useState, useRef } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { Chess } from 'chess.js';
import { ChessBoard } from '@/components/game/ChessBoard';
import { ChatDrawer } from '@/components/game/ChatDrawer';
import { GameOverModal } from '@/components/game/GameOverModal';
import { GameHeader } from '@/components/game/GameHeader';
import { JoinScreen } from '@/components/game/JoinScreen';
import { WaitingScreen } from '@/components/game/WaitingScreen';
import { useGameSocket } from '@/hooks/useGameSocket';

const { width, height } = Dimensions.get('window');
const boardSize = Math.min(width - 40, 380);

export default function GameScreen() {
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const [game] = useState(() => new Chess());
  const [playerName, setPlayerName] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [boardKey, setBoardKey] = useState(0);
  const [chatVisible, setChatVisible] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [chatMessages, setChatMessages] = useState<string[]>([]);
  const [messageText, setMessageText] = useState('');
  const [showGameOver, setShowGameOver] = useState(false);
  const [gameResult, setGameResult] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);
  const slideAnim = useRef(new Animated.Value(height)).current;

  const handleMove = (move: any) => {
    try {
      const result = game.move(move);
      if (result) {
        setBoardKey(prev => prev + 1);
        updateGameStatus();
      }
    } catch (e) {
      console.log('Invalid move:', e);
    }
  };

  const handleChat = (msg: string) => {
    setChatMessages(prev => [...prev, msg]);
    if (!chatVisible) setUnreadCount(prev => prev + 1);
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const { role, gameStarted, status, setStatus, joinGame, sendMove, sendChat } = useGameSocket(
    roomId,
    handleMove,
    handleChat
  );

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
    const result = game.move(move);
    if (result) {
      sendMove(result);
      setBoardKey(prev => prev + 1);
      updateGameStatus();
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

  const handleJoin = () => {
    if (joinGame(playerName)) setIsJoining(true);
  };

  const handleExit = () => {
    game.reset();
    router.back();
  };

  const handleRematch = () => {
    setShowGameOver(false);
    game.reset();
    setBoardKey(prev => prev + 1);
    router.replace(`/game/${roomId}`);
  };

  // Screen states
  if (!isJoining && !gameStarted) {
    return <JoinScreen roomId={roomId} playerName={playerName} onPlayerNameChange={setPlayerName} onJoin={handleJoin} />;
  }

  if (!gameStarted) {
    return <WaitingScreen roomId={roomId} playerName={playerName} status={status} />;
  }

  // Main game screen
  return (
    <View style={styles.container}>
      <GameHeader
        role={role}
        playerName={playerName}
        unreadCount={unreadCount}
        onChatPress={showChatDrawer}
        onExitPress={handleExit}
      />

      <View style={styles.boardContainer}>
        <ChessBoard key={boardKey} game={game} role={role} onMove={onMove} boardSize={boardSize} />
      </View>

      <View style={styles.statusCard}>
        <Text style={styles.statusText}>{status}</Text>
      </View>

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  boardContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  statusCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  statusText: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
});