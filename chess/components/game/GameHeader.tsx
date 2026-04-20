import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'; // Added Text

interface GameHeaderProps {
  role: 'w' | 'b';
  playerName: string;
  unreadCount: number;
  onChatPress: () => void;
  onExitPress: () => void;
}

export function GameHeader({ role, playerName, unreadCount, onChatPress, onExitPress }: GameHeaderProps) {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.roleText}>♔ {role === 'w' ? 'White' : 'Black'} ♚</Text>
        <Text style={styles.playerNameText}>{playerName}</Text>
      </View>
      <View style={styles.headerButtons}>
        <TouchableOpacity onPress={onChatPress} style={styles.chatButton}>
          <Text style={styles.chatButtonText}>💬</Text>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={onExitPress} style={styles.exitButton}>
          <Text style={styles.exitButtonText}>✕</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
});