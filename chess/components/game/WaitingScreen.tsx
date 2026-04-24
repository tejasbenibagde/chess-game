import { View, Text, ActivityIndicator } from 'react-native';
import { useAppTheme } from '@/hooks/use-app-theme';

interface WaitingScreenProps {
  roomId: string;
  playerName: string;
  status: string;
}

export function WaitingScreen({ roomId, playerName, status }: WaitingScreenProps) {
  const { colors } = useAppTheme();

  return (
    <View
      className="flex-1 justify-center items-center p-6"
      style={{ backgroundColor: colors.background }}
    >
      <Text className="text-2xl font-bold mb-2" style={{ color: colors.foreground }}>
        ♜ Waiting for opponent... ♞
      </Text>
      <Text className="text-lg font-semibold mb-5" style={{ color: colors.primary }}>
        Room Code: {roomId}
      </Text>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text className="text-sm text-center mt-5" style={{ color: colors.mutedForeground }}>
        {status || 'Waiting for opponent...'}
      </Text>
      <Text className="text-sm mt-3 font-medium" style={{ color: colors.foreground }}>
        Playing as: {playerName}
      </Text>
    </View>
  );
}
