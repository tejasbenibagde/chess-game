import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native'; // Added Text

interface JoinScreenProps {
  roomId: string;
  playerName: string;
  onPlayerNameChange: (name: string) => void;
  onJoin: () => void;
}

export function JoinScreen({ roomId, playerName, onPlayerNameChange, onJoin }: JoinScreenProps) {
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>♜ Chess Game ♞</Text>
        <Text style={styles.subtitle}>Room: {roomId}</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          value={playerName}
          onChangeText={onPlayerNameChange}
          maxLength={20}
          autoFocus
        />
        
        <TouchableOpacity style={styles.button} onPress={onJoin}>
          <Text style={styles.buttonText}>Join Game</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  card: {
    width: '100%',
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#4CAF50',
    fontWeight: '600',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  button: {
    width: '100%',
    backgroundColor: '#4CAF50',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});