import React from 'react';
import Layout from '@/components/layout/Layout';

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  console.log('Chat Layout');

  return <Layout>{children}</Layout>;
}
