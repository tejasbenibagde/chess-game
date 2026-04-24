// hooks/use-theme-color.ts
import { THEME } from '@/lib/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof THEME.light
) {
  const theme = useColorScheme();
  const colorFromProps = props[theme as 'light' | 'dark'];

  if (colorFromProps) {
    return colorFromProps;
  }
  
  const themeKey = theme === 'dark' ? 'dark' : 'light';
  return THEME[themeKey][colorName];
}
