import { View, Text, TouchableOpacity } from 'react-native';
import { useAppTheme } from '@/hooks/use-app-theme';

interface GameHeaderProps {
  role: 'w' | 'b';
  playerName: string;
  unreadCount: number;
  onChatPress: () => void;
  onExitPress: () => void;
}

export function GameHeader({ role, playerName, unreadCount, onChatPress, onExitPress }: GameHeaderProps) {
  const { colors } = useAppTheme();

  return (
    <View
      className="flex-row justify-between items-center px-5 pt-3 pb-2"
      style={{ backgroundColor: colors.background }}
    >
      <View>
        <Text className="text-lg font-bold" style={{ color: colors.foreground }}>
          ♔ {role === 'w' ? 'White' : 'Black'} ♚
        </Text>
        <Text className="text-xs mt-1" style={{ color: colors.mutedForeground }}>
          {playerName}
        </Text>
      </View>

      <View className="flex-row space-x-2">
        <TouchableOpacity
          onPress={onChatPress}
          className="w-10 h-10 rounded-full items-center justify-center"
          style={{ backgroundColor: colors.primary }}
        >
          <Text className="text-xl" style={{ color: colors.primaryForeground }}>
            💬
          </Text>
          {unreadCount > 0 && (
            <View
              className="absolute top-0 right-0 rounded-full px-2 h-5 items-center justify-center"
              style={{ backgroundColor: colors.destructive }}
            >
              <Text className="text-[11px] font-bold" style={{ color: colors.primaryForeground }}>
                {unreadCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onExitPress}
          className="w-10 h-10 rounded-full items-center justify-center"
          style={{ backgroundColor: colors.destructive }}
        >
          <Text className="text-xl font-semibold" style={{ color: colors.primaryForeground }}>
            ✕
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}