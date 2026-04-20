import { Stack } from 'expo-router';

export default function GameLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="[roomId]" 
        options={{ 
          headerShown: false,
          title: 'Chess Game',
          headerBackTitle: 'Back'
        }} 
      />
      <Stack.Screen 
        name="computer" 
        options={{ 
          headerShown: false,
          title: 'vs Computer'
        }} 
      />
    </Stack>
  );
}