import Layout from '@/components/layout/Layout';
import { ContentLayout } from '@/components/panel/content-layout';
import React from 'react';

import Main from '@/components/chat/main';

export default async function Home() {
  console.log('Home');

  return (
    <Layout>
      <ContentLayout title="Home">
        <Main />
      </ContentLayout>
    </Layout>
  );
}
