import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'; // Added Text

interface WaitingScreenProps {
  roomId: string;
  playerName: string;
  status: string;
}

export function WaitingScreen({ roomId, playerName, status }: WaitingScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.waitingText}>♜ Waiting for opponent... ♞</Text>
      <Text style={styles.roomCode}>Room Code: {roomId}</Text>
      <ActivityIndicator size="large" color="#4CAF50" />
      <Text style={styles.status}>{status || 'Share this code with your friend to play!'}</Text>
      <Text style={styles.playerName}>Playing as: {playerName}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  roomCode: {
    fontSize: 18,
    color: '#4CAF50',
    fontWeight: '600',
    marginBottom: 20,
  },
  status: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
  playerName: {
    fontSize: 14,
    marginTop: 10,
    fontWeight: '500',
  },
});