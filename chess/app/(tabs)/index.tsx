import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter, useFocusEffect } from 'expo-router';
import { io } from 'socket.io-client';

export default function HomeScreen() {
  const router = useRouter();
  const [isSearching, setIsSearching] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [playerName, setPlayerName] = useState('');

  // Reset searching state when screen comes into focus
  useFocusEffect(
    () => {
      // Reset when returning to this screen
      setIsSearching(false);
    }
  );

  const handleQuickPlay = async () => {
    setIsSearching(true);
    // Generate a random room ID for quick play
    const newRoomId = Math.random().toString(36).substring(7);
    router.push(`/game/${newRoomId}`);
  };

  const handleJoinWithCode = () => {
    Alert.prompt('Enter Room Code', 'Enter the room code to join', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Join', 
        onPress: (code: any) => {
          if (code) router.push(`/game/${code}`);
        }
      }
    ]);
  };

  const handlePlayComputer = () => {
    router.push('/game/computer');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Chess Master</Text>
      
      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>Your Stats</Text>
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>124</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>45</Text>
            <Text style={styles.statLabel}>Wins</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Losses</Text>
          </View>
        </View>
      </View>

      <View style={styles.buttonGroup}>
        <TouchableOpacity 
          style={[styles.button, styles.primaryButton]} 
          onPress={handleQuickPlay}
          disabled={isSearching}
        >
          <Text style={styles.buttonText}>{isSearching ? 'Searching...' : 'Quick Play'}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.secondaryButton]} 
          onPress={handleJoinWithCode}
        >
          <Text style={styles.buttonText}>Join with Code</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.outlineButton]} 
          onPress={handlePlayComputer}
        >
          <Text style={styles.outlineButtonText}>Play vs Computer</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Recent Games</Text>
        <Text style={styles.infoText}>No recent games</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  statsCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  buttonGroup: {
    gap: 12,
    marginBottom: 20,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#4CAF50',
  },
  secondaryButton: {
    backgroundColor: '#2196F3',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  outlineButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 15,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  infoText: {
    color: '#666',
    textAlign: 'center',
    padding: 20,
  },
});