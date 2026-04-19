// app/_layout.tsx
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="game/[roomId]" options={{ headerShown: true, title: 'Chess Game' }} />
      </Stack>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}