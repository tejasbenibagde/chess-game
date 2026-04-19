import { Stack } from 'expo-router';

export default function GameLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="[roomId]" 
        options={{ 
          headerShown: true,
          title: 'Chess Game',
          headerBackTitle: 'Back'
        }} 
      />
      <Stack.Screen 
        name="computer" 
        options={{ 
          headerShown: true,
          title: 'vs Computer'
        }} 
      />
    </Stack>
  );
}