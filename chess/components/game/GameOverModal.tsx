import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native'; // Added Text

interface GameOverModalProps {
  visible: boolean;
  result: string;
  onRematch: () => void;
  onExit: () => void;
}

export function GameOverModal({ visible, result, onRematch, onExit }: GameOverModalProps) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>🏆 Game Over 🏆</Text>
          <Text style={styles.message}>{result}</Text>
          <View style={styles.buttonGroup}>
            <TouchableOpacity style={[styles.button, styles.rematchButton]} onPress={onRematch}>
              <Text style={styles.buttonText}>Play Again</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.exitButton]} onPress={onExit}>
              <Text style={styles.buttonText}>Exit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '85%',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 24,
    color: '#333',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  rematchButton: {
    backgroundColor: '#4CAF50',
  },
  exitButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});