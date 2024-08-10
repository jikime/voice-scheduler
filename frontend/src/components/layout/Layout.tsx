'use client';

import React from 'react';
import PanelLayout from '@/components/panel/panel-layout';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  console.log('component Layout');
  

  return <PanelLayout>{children}</PanelLayout>;
}
