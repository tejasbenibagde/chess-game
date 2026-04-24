// app/_layout.tsx
import './global.css';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PortalHost } from '@rn-primitives/portal';
import { useAppTheme } from '@/hooks/use-app-theme';
import { ThemeProvider } from '@/components/theme-provider';

function RootLayoutContent() {
  const { isDark } = useAppTheme();

  return (
    <SafeAreaProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="game/[roomId]" options={{ headerShown: true, title: 'Chess Game' }} />
      </Stack>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <PortalHost />
    </SafeAreaProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootLayoutContent />
    </ThemeProvider>
  );
}