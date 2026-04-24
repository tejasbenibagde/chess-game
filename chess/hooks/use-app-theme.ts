// hooks/useAppTheme.ts
import { useMemo } from 'react';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { THEME } from '@/lib/theme';

export function useAppTheme() {
  const colorScheme = useColorScheme();
  const theme = colorScheme ?? 'light';
  const colors = THEME[theme];
  const isDark = theme === 'dark';

  return useMemo(() => ({ theme, colors, isDark }), [theme, colors, isDark]);
}