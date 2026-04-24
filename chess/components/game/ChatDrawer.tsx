import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, Animated, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import { forwardRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { useAppTheme } from '@/hooks/use-app-theme';

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
  const [isTyping, setIsTyping] = useState(false);
  const { colors } = useAppTheme();

  return (
    <Modal transparent visible={visible} animationType="none">
      {/* Background overlay - closes when tapping outside */}
      <View className="flex-1 bg-black/50 justify-end">
        {/* Clickable area outside the drawer */}
        <TouchableOpacity 
          activeOpacity={1} 
          onPress={onClose}
          className="flex-1"
        />
        
        {/* Drawer content - prevents touch from bubbling up */}
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="justify-end"
        >
          <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            <Animated.View 
              style={[{ transform: [{ translateY: slideAnim }] }, { backgroundColor: colors.background }]}
              className="rounded-t-2xl"
            >
              {/* Header */}
              <View className="flex-row justify-between items-center p-4"
                style={{ borderBottomColor: colors.border, borderBottomWidth: 1 }}
              >
                <View className="flex-row items-center gap-2">
                  <Text className="text-2xl">💬</Text>
                  <Text className="text-lg font-semibold">Chat</Text>
                  {messages.length > 0 && (
                    <View className="bg-green-100 px-2 py-0.5 rounded-full">
                      <Text className="text-green-700 text-xs font-medium">{messages.length}</Text>
                    </View>
                  )}
                </View>
                <TouchableOpacity 
                  onPress={onClose} 
                  className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center"
                >
                  <Text className="text-gray-600 text-lg">▼</Text>
                </TouchableOpacity>
              </View>
              
              {/* Messages Area */}
              <View className="h-96">
                <ScrollView 
                  ref={ref}
                  className="flex-1"
                  contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12 }}
                  showsVerticalScrollIndicator={false}
                >
                  {messages.length === 0 ? (
                    <View className="items-center justify-center h-80">
                      <Text className="text-5xl mb-3">💭</Text>
                      <Text className="text-gray-400 text-base">No messages yet</Text>
                      <Text className="text-gray-300 text-sm mt-1">Say hello to your opponent!</Text>
                    </View>
                  ) : (
                    messages.map((msg, i) => {
                      const isOwnMessage = msg.startsWith('You:');
                      return (
                        <View 
                          key={i} 
                          className={cn(
                            "max-w-[80%] rounded-lg p-3 mb-2 self-start",
                            isOwnMessage ? 'self-end rounded-br-none' : 'self-start rounded-bl-none'
                          )}
                          style={{ backgroundColor: isOwnMessage ? colors.primary : colors.muted }}
                        >
                          <Text className="text-sm" style={{ color: isOwnMessage ? colors.primaryForeground : colors.foreground }}>
                            {msg}
                          </Text>
                        </View>
                      );
                    })
                  )}
                  {/* Typing indicator */}
                  {isTyping && (
                    <View className="bg-gray-100 rounded-lg p-2 self-start max-w-[30%]">
                      <Text className="text-gray-500 text-xs">typing...</Text>
                    </View>
                  )}
                </ScrollView>
              </View>
              
              {/* Input Area */}
              <View className="p-3 border-t">
                <View className="flex-row gap-2 items-center">
                  <View className="flex-1">
                    <TextInput
                      className="border rounded-full px-4 py-2.5 text-base"
                      style={{ backgroundColor: colors.muted, borderColor: colors.border, color: colors.foreground }}
                      placeholder="Type a message..."
                      placeholderTextColor={colors.mutedForeground}
                      value={messageText}
                      onChangeText={(text) => {
                        onMessageChange(text);
                        setIsTyping(text.length > 0);
                        // Reset typing indicator after 1.5 seconds of no input
                        setTimeout(() => {
                          if (text.length === 0) setIsTyping(false);
                        }, 1500);
                      }}
                      onSubmitEditing={onSend}
                      returnKeyType="send"
                      maxLength={200}
                    />
                  </View>
                  <TouchableOpacity 
                    className={cn(
                      "px-5 py-2.5 rounded-full",
                      messageText.trim() ? "bg-green-600" : "bg-gray-300"
                    )}
                    onPress={onSend}
                    disabled={!messageText.trim()}
                  >
                    <Text className={cn(
                      "font-semibold",
                      messageText.trim() ? "text-white" : "text-gray-500"
                    )}>
                      Send
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
});