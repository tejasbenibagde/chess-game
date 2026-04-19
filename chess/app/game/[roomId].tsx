import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ActivityIndicator, ScrollView, TextInput, KeyboardAvoidingView, Platform, Modal, Animated } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { Chess } from 'chess.js';
import { io } from 'socket.io-client';

const { width, height } = Dimensions.get('window');
const boardSize = Math.min(width - 40, 380);

// ChessBoard component
function ChessBoard({ game, role, onMove, refreshTrigger }: any) {
  const [selected, setSelected] = useState<string | null>(null);
  const board = game.board();
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
  
  const displayFiles = role === 'w' ? files : [...files].reverse();
  const displayRanks = role === 'w' ? ranks : [...ranks].reverse();

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
              {piece && (
                <Text style={{ fontSize: 36 }}>
                  {piece.type === 'k' ? (piece.color === 'w' ? '♔' : '♚') :
                   piece.type === 'q' ? (piece.color === 'w' ? '♕' : '♛') :
                   piece.type === 'r' ? (piece.color === 'w' ? '♖' : '♜') :
                   piece.type === 'b' ? (piece.color === 'w' ? '♗' : '♝') :
                   piece.type === 'n' ? (piece.color === 'w' ? '♘' : '♞') : 
                   piece.color === 'w' ? '♙' : '♟'}
                </Text>
              )}
            </TouchableOpacity>
          );
        })
      )}
    </View>
  );
}

export default function GameScreen() {
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const [socket, setSocket] = useState<any>(null);
  const [game] = useState(() => new Chess());
  const [gameStarted, setGameStarted] = useState(false);
  const [role, setRole] = useState<'w' | 'b'>('w');
  const [status, setStatus] = useState('');
  const [chat, setChat] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [showGameOver, setShowGameOver] = useState(false);
  const [gameResult, setGameResult] = useState<string>('');
  const [playerName, setPlayerName] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [boardKey, setBoardKey] = useState(0);
  const [chatVisible, setChatVisible] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const slideAnim = useRef(new Animated.Value(height)).current;

  const refreshBoard = () => {
    setBoardKey(prev => prev + 1);
    updateStatus();
  };

  const updateStatus = () => {
    let statusText = '';
    const moveColor = game.turn() === 'b' ? 'Black' : 'White';
    
    if (game.isCheckmate()) {
      const winner = game.turn() === 'w' ? 'Black' : 'White';
      statusText = `Checkmate! ${winner} wins!`;
      setGameResult(`${winner} wins by checkmate!`);
      setShowGameOver(true);
    } else if (game.isStalemate()) {
      statusText = 'Stalemate! Game drawn!';
      setGameResult('Game drawn by stalemate');
      setShowGameOver(true);
    } else if (game.isThreefoldRepetition()) {
      statusText = 'Threefold repetition! Game drawn!';
      setGameResult('Game drawn by repetition');
      setShowGameOver(true);
    } else {
      statusText = `${moveColor} to move`;
      if (game.isCheck()) statusText += ` ⚠️ ${moveColor} is in check!`;
    }
    
    setStatus(statusText);
  };

  const showChatDrawer = () => {
    setChatVisible(true);
    setUnreadCount(0);
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 65,
      friction: 11,
    }).start();
  };

  const hideChatDrawer = () => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 250,
      useNativeDriver: true,
    }).start(() => setChatVisible(false));
  };

  useEffect(() => {
    const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
    const newSocket = io(API_URL, { transports: ['websocket'] });
    
    newSocket.on('connect', () => {
      console.log('Connected to server');
    });
    
    newSocket.on('userrole', ({ role: userRole, room }: { role: 'w' | 'b'; room: string }) => {
      console.log('Assigned role:', userRole, 'in room:', room);
      setRole(userRole);
    });
    
    newSocket.on('startGame', ({ message: startMsg, room }: { message: string; room: string }) => {
      console.log('Game started in room:', room);
      setGameStarted(true);
      setStatus('Game started! Good luck!');
      refreshBoard();
    });
    
    newSocket.on('move', (move: any) => {
      console.log('Move received:', move);
      try {
        const result = game.move(move);
        if (result) {
          console.log('Move applied successfully');
          refreshBoard();
        }
      } catch (e) {
        console.log('Error applying move:', e);
      }
    });
    
    newSocket.on('chatMessage', (msg: string) => {
      console.log('Chat received:', msg);
      setChat(prev => [...prev, msg]);
      if (!chatVisible) {
        setUnreadCount(prev => prev + 1);
      }
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });
    
    newSocket.on('waitingForOpponent', ({ message: waitMsg }: { message: string }) => {
      console.log('Waiting for opponent:', waitMsg);
      setStatus(waitMsg);
      setGameStarted(false);
    });
    
    newSocket.on('opponent-disconnected', () => {
      setStatus('Opponent disconnected!');
      setGameResult('Opponent left the game');
      setShowGameOver(true);
    });
    
    setSocket(newSocket);
    
    return () => {
      newSocket.disconnect();
    };
  }, []);

  const joinGame = () => {
    if (!playerName.trim()) {
      alert('Please enter your name');
      return;
    }
    if (socket) {
      setIsJoining(true);
      socket.emit('join-game', roomId, playerName);
    }
  };
  
  const onMove = (move: any) => {
    if (!socket || !gameStarted) return;
    
    try {
      const result = game.move(move);
      if (result) {
        console.log('Emitting move:', result);
        socket.emit('move', result);
        refreshBoard();
      }
    } catch (err) {
      console.log('Invalid move:', err);
    }
  };
  
  const sendChat = () => {
    if (message.trim() && socket) {
      const chatMessage = `${playerName}: ${message}`;
      console.log('Sending chat:', chatMessage);
      socket.emit('chatMessage', chatMessage);
      setChat(prev => [...prev, `You: ${message}`]);
      setMessage('');
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };
  
  const resetGame = () => {
    game.reset();
    setShowGameOver(false);
    setGameResult('');
    setGameStarted(false);
    setStatus('');
    setChat([]);
    router.back();
  };
  
  // Join screen
  if (!isJoining && !gameStarted) {
    return (
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.joinContainer}>
        <View style={styles.joinCard}>
          <Text style={styles.joinTitle}>♜ Chess Game ♞</Text>
          <Text style={styles.joinSubtitle}>Room: {roomId}</Text>
          
          <TextInput
            style={styles.nameInput}
            placeholder="Enter your name"
            value={playerName}
            onChangeText={setPlayerName}
            maxLength={20}
            autoFocus
          />
          
          <TouchableOpacity style={styles.joinButton} onPress={joinGame}>
            <Text style={styles.joinButtonText}>Join Game</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }
  
  // Waiting screen
  if (!gameStarted) {
    return (
      <View style={styles.waitingContainer}>
        <Text style={styles.waitingText}>♜ Waiting for opponent... ♞</Text>
        <Text style={styles.waitingSubtext}>Room Code: {roomId}</Text>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.statusText}>{status || 'Share this code with your friend to play!'}</Text>
        <Text style={styles.playerNameText}>Playing as: {playerName}</Text>
      </View>
    );
  }
  
  // Game screen
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.roleText}>♔ {role === 'w' ? 'White' : 'Black'} ♚</Text>
          <Text style={styles.playerNameText}>{playerName}</Text>
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity onPress={showChatDrawer} style={styles.chatButton}>
            <Text style={styles.chatButtonText}>💬</Text>
            {unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>{unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={resetGame} style={styles.exitButton}>
            <Text style={styles.exitButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.boardContainer}>
        <ChessBoard 
          key={boardKey}
          game={game} 
          role={role} 
          onMove={onMove}
          refreshTrigger={boardKey}
        />
      </View>
      
      <View style={styles.statusCard}>
        <Text style={styles.statusText}>{status}</Text>
      </View>
      
      {/* Chat Drawer */}
      {chatVisible && (
        <Modal transparent visible={chatVisible} animationType="none">
          <TouchableOpacity style={styles.drawerOverlay} onPress={hideChatDrawer} activeOpacity={1}>
            <Animated.View 
              style={[styles.drawerContent, { transform: [{ translateY: slideAnim }] }]}
            >
              <View style={styles.drawerHeader}>
                <Text style={styles.drawerTitle}>💬 Chat</Text>
                <TouchableOpacity onPress={hideChatDrawer} style={styles.drawerClose}>
                  <Text style={styles.drawerCloseText}>▼</Text>
                </TouchableOpacity>
              </View>
              
              <ScrollView 
                ref={scrollViewRef}
                style={styles.drawerScroll}
                contentContainerStyle={styles.drawerScrollContent}
              >
                {chat.length === 0 ? (
                  <View style={styles.emptyChat}>
                    <Text style={styles.emptyChatText}>No messages yet</Text>
                    <Text style={styles.emptyChatSubtext}>Say hello to your opponent!</Text>
                  </View>
                ) : (
                  chat.map((msg, i) => (
                    <View key={i} style={styles.chatBubble}>
                      <Text style={styles.chatMessage}>{msg}</Text>
                    </View>
                  ))
                )}
              </ScrollView>
              
              <View style={styles.drawerInputWrapper}>
                <TextInput
                  style={styles.drawerInput}
                  placeholder="Type a message..."
                  value={message}
                  onChangeText={setMessage}
                  onSubmitEditing={sendChat}
                  returnKeyType="send"
                  autoFocus
                />
                <TouchableOpacity style={styles.drawerSendButton} onPress={sendChat}>
                  <Text style={styles.drawerSendText}>Send</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </TouchableOpacity>
        </Modal>
      )}
      
      {/* Game Over Modal */}
      {showGameOver && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>🏆 Game Over 🏆</Text>
            <Text style={styles.modalMessage}>{gameResult}</Text>
            <View style={styles.modalButtonGroup}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.rematchButton]} 
                onPress={() => {
                  setShowGameOver(false);
                  game.reset();
                  refreshBoard();
                  setGameStarted(false);
                  router.replace(`/game/${roomId}`);
                }}
              >
                <Text style={styles.modalButtonText}>Play Again</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.exitModalButton]} 
                onPress={resetGame}
              >
                <Text style={styles.modalButtonText}>Exit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  joinContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  joinCard: {
    width: '100%',
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  joinTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  joinSubtitle: {
    fontSize: 18,
    color: '#4CAF50',
    fontWeight: '600',
    marginBottom: 30,
  },
  nameInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  joinButton: {
    width: '100%',
    backgroundColor: '#4CAF50',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  waitingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  waitingText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  waitingSubtext: {
    fontSize: 18,
    color: '#4CAF50',
    fontWeight: '600',
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 5,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  roleText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  playerNameText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  chatButton: {
    backgroundColor: '#4CAF50',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  chatButtonText: {
    fontSize: 20,
  },
  unreadBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#f44336',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  unreadText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  exitButton: {
    backgroundColor: '#f44336',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  boardContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
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
  // Drawer styles
  drawerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  drawerContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: height * 0.6,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  drawerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  drawerClose: {
    padding: 8,
  },
  drawerCloseText: {
    fontSize: 20,
  },
  drawerScroll: {
    flex: 1,
  },
  drawerScrollContent: {
    padding: 12,
  },
  drawerInputWrapper: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    gap: 8,
  },
  drawerInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 14,
  },
  drawerSendButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    justifyContent: 'center',
  },
  drawerSendText: {
    color: '#fff',
    fontWeight: '600',
  },
  emptyChat: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  emptyChatText: {
    color: '#999',
    fontSize: 14,
  },
  emptyChatSubtext: {
    color: '#bbb',
    fontSize: 12,
    marginTop: 5,
  },
  chatBubble: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  chatMessage: {
    fontSize: 13,
    color: '#333',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '85%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 24,
    color: '#333',
  },
  modalButtonGroup: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  rematchButton: {
    backgroundColor: '#4CAF50',
  },
  exitModalButton: {
    backgroundColor: '#f44336',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});