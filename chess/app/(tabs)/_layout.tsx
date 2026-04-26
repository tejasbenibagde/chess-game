import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';
import { useAppTheme } from '@/hooks/use-app-theme';
import { cn } from '@/lib/utils';

// Simple tab bar icon component
function TabIcon({ icon, focused
}: any) {
  return (
    <View className="items-center">
      <Text className={cn(
        "text-2xl",
        focused && "scale-110 transition-transform"
      )}>{icon}</Text>
    </View>
  );
}

export default function TabLayout() {
  const { colors } = useAppTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({focused}) => <TabIcon icon="🏠" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({focused}) => <TabIcon icon="👤" focused={focused} />,
        }}
      />
    </Tabs>
  );
}