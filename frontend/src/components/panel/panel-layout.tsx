'use client';

import { cn } from '@/lib/utils';
import React, { ReactNode } from 'react';

interface PanelLayoutProps {
  children: ReactNode;
}

export default function PanelLayout({ children }: PanelLayoutProps) {
  console.log('PanelLayout');

  return (
    <>
      <main
        className={cn(
          'min-h-[calc(100vh_-_56px)] bg-zinc-50 dark:bg-zinc-950 transition-[margin-left] ease-in-out duration-300'
        )}
      >
        {children}
      </main>
    </>
  );
}
