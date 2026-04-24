import { Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '@/hooks/use-app-theme';

export default function ProfileScreen() {
  const { colors } = useAppTheme();

  return (
    <SafeAreaView style={{ backgroundColor: colors.background }} className="flex-1">
      <ScrollView className="flex-1 px-5 pt-5">
        <Text style={{ color: colors.foreground }}>This page is still under development</Text>
      </ScrollView>
    </SafeAreaView>
  );
}