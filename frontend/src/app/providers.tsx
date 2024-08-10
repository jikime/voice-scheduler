'use client';

import { ThemeProvider } from '@/components/provider/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <TooltipProvider delayDuration={1}>
          {children}
        </TooltipProvider>
      </ThemeProvider>
  );
}
