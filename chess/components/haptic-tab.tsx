// components/haptic-tab.tsx
import { TouchableOpacity } from 'react-native';

export function HapticTab(props: any) {
  return <TouchableOpacity activeOpacity={0.7} {...props} />;
}