import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';

// Simple tab bar icon component
function TabIcon({ icon }: any) {
  return (
    <View className="items-center">
      <Text className="text-2xl">{icon}</Text>
    </View>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
          borderTopWidth: 1,
          borderTopColor: isDark ? '#333' : '#e5e5e5',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: isDark ? '#888' : '#999',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: () => <TabIcon icon="🏠" />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: () => <TabIcon icon="👤" />,
        }}
      />
    </Tabs>
  );
}