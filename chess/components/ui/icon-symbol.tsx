// components/ui/icon-symbol.tsx
import { Text } from 'react-native';

export function IconSymbol({ size, name, color }: { size: number; name: string; color: string }) {
  // Simple emoji fallback for icons
  const getIcon = () => {
    if (name.includes('house')) return '🏠';
    if (name.includes('paperplane')) return '✈️';
    return '🎮';
  };
  
  return <Text style={{ fontSize: size, color }}>{getIcon()}</Text>;
}