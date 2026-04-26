import { View, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/Button';
import { useAppTheme } from '@/hooks/use-app-theme';
import { cn } from '@/lib/utils';

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();

  const handleQuickPlay = () => {
    const newRoomId = Math.random().toString(36).substring(7);
    router.push(`/game/${newRoomId}`);
  };

  const handlePlayComputer = () => {
    router.push('/game/computer');
  };

  return (
    <SafeAreaView style={{ backgroundColor: colors.background }} className={cn("flex-1")}>
      <ScrollView 
        className="flex-1 px-5"
        contentContainerStyle={{ 
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {/* Quick Play Button */}
        <Button variant={"default"} onPress={handleQuickPlay} size="lg" className={cn("mb-6 w-full")}>
          Quick Play
        </Button>

        {/* Play vs Computer */}
        <Button variant={"secondary"} onPress={handlePlayComputer} className={cn("mb-6 w-full")}>
          Play vs Computer
        </Button>

        {/* Puzzles */}
        <Button variant={"secondary"} onPress={handlePlayComputer} className={cn("mb-6 w-full")}>
          Puzzles
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}