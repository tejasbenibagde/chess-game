import { View, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/Button';
import { useAppTheme } from '@/hooks/use-app-theme';

export default function HomeScreen() {
  const router = useRouter();
  const { isDark, colors } = useAppTheme();

  const handleQuickPlay = () => {
    const newRoomId = Math.random().toString(36).substring(7);
    router.push(`/game/${newRoomId}`);
  };

  const handlePlayComputer = () => {
    router.push('/game/computer');
  };

  return (
    <SafeAreaView style={{ backgroundColor: colors.background }} className="flex-1">
      <ScrollView className="flex-1 px-5 pt-5">
        {/* Header */}
        <View className="items-center mb-8">
          <Text className="text-5xl mb-2">♜ ♞ ♝</Text>
          <Text style={{ color: colors.primary }} className="text-4xl font-bold text-center">
            Chess Master
          </Text>
          <Text style={{ color: colors.mutedForeground }} className="text-center mt-2">
            Play chess with friends online
          </Text>
        </View>

        {/* Quick Play Button */}
        <Button onPress={handleQuickPlay} size="lg" className="mb-3">
          ⚡ Quick Play
        </Button>

        {/* Play vs Computer */}
        <Button variant="outline" onPress={handlePlayComputer} className="mb-6">
          🤖 Play vs Computer
        </Button>
    
      </ScrollView>
    </SafeAreaView>
  );
}