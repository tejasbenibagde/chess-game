// components/GameOverModal.tsx

import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Button } from '@/components/ui/Button';// incomplete

interface GameOverModalProps {
  visible: boolean;
  result: {
    winner: 'w' | 'b' | 'draw';
    reason: string;
  } | null;
  onClose: () => void;
  onRematch: () => void;
}

export function GameOverModal({ visible, result, onClose, onRematch }: GameOverModalProps) {
  if (!result) return null;

  const getMessage = () => {
    if (result.winner === 'draw') {
      return `Game Drawn by ${result.reason}`;
    }
    return `${result.winner === 'w' ? 'White' : 'Black'} wins by ${result.reason}!`;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Game Over</Text>
          <Text style={styles.message}>{getMessage()}</Text>
          
          <View style={styles.buttonGroup}>
            <Button 
              title="Rematch" 
              onPress={onRematch}
              variant="primary"
              style={styles.button}
            />
            <Button 
              title="Exit" 
              onPress={onClose}
              variant="secondary"
              style={styles.button}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    width: '80%',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    color: '#666',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  button: {
    flex: 1,
  },
});