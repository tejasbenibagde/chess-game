import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, Animated, StyleSheet, Dimensions } from 'react-native';
import { forwardRef } from 'react';

const { height } = Dimensions.get('window');

interface ChatDrawerProps {
  visible: boolean;
  messages: string[];
  messageText: string;
  onMessageChange: (text: string) => void;
  onSend: () => void;
  onClose: () => void;
  slideAnim: Animated.Value;
}

export const ChatDrawer = forwardRef<ScrollView, ChatDrawerProps>(({
  visible,
  messages,
  messageText,
  onMessageChange,
  onSend,
  onClose,
  slideAnim,
}, ref) => {
  return (
    <Modal transparent visible={visible} animationType="none">
      <TouchableOpacity style={styles.overlay} onPress={onClose} activeOpacity={1}>
        <Animated.View style={[styles.drawer, { transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.header}>
            <Text style={styles.title}>💬 Chat</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>▼</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            ref={ref}
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
          >
            {messages.length === 0 ? (
              <View style={styles.emptyChat}>
                <Text style={styles.emptyText}>No messages yet</Text>
                <Text style={styles.emptySubtext}>Say hello to your opponent!</Text>
              </View>
            ) : (
              messages.map((msg, i) => (
                <View key={i} style={styles.messageBubble}>
                  <Text style={styles.messageText}>{msg}</Text>
                </View>
              ))
            )}
          </ScrollView>
          
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Type a message..."
              value={messageText}
              onChangeText={onMessageChange}
              onSubmitEditing={onSend}
              returnKeyType="send"
            />
            <TouchableOpacity style={styles.sendButton} onPress={onSend}>
              <Text style={styles.sendText}>Send</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
});

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  drawer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: height * 0.6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
  },
  closeText: {
    fontSize: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 12,
  },
  emptyChat: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  emptyText: {
    color: '#999',
    fontSize: 14,
  },
  emptySubtext: {
    color: '#bbb',
    fontSize: 12,
    marginTop: 5,
  },
  messageBubble: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  messageText: {
    fontSize: 13,
    color: '#333',
  },
  inputWrapper: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 14,
  },
  sendButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    justifyContent: 'center',
  },
  sendText: {
    color: '#fff',
    fontWeight: '600',
  },
});