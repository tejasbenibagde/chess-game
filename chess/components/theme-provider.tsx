// components/ThemeProvider.tsx
import { useEffect } from 'react';
import { useAppTheme } from '@/hooks/use-app-theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useAppTheme();

  useEffect(() => {
    // For web: add/remove 'dark' class on html element
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (theme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [theme]);

  return <>{children}</>;
}