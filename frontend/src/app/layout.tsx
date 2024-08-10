import '@/styles/globals.css';
import React from 'react';
import { Providers } from '@/app/providers';
import { DynamicMetadata } from '@/components/common/dynamic-metadata';
import type { Metadata } from 'next';
import {
  inter,
  nanumBarunGothic,
  nanumSquareBold,
  nanumSquareLight,
  nanumSquareRegular,
  notoSansKr,
  roboto,
  robotoMono,
} from './fonts/font';

export const metadata: Metadata = {
  title: {
    default: 'Voice Scheduler',
    template: '%s | Voice Scheduler',
  },
  description: '',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  console.log('RootLayout');
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${nanumSquareRegular.variable} ${nanumSquareBold.variable} ${nanumSquareLight.variable} ${notoSansKr.variable} ${roboto.variable} ${inter.variable} ${robotoMono.variable}  ${nanumBarunGothic.variable} min-h-screen bg-background overflow-hidden`}
      >
        <Providers>
          <DynamicMetadata />
          {children}
        </Providers>
      </body>
    </html>
  );
}
