'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export function DynamicMetadata() {
  const pathname = usePathname();

  useEffect(() => {
    // 경로에 따라 동적으로 메타데이터 설정
    let title = 'Voice Scheduler';
    let description = '';

    switch (pathname) {
      case '/':
        title = 'Home | Voice Scheduler';
        description = 'Welcome to Review Hub - Your central hub for all reviews';
        break;
      case '/chat':
        title = 'Chat | Voice Scheduler';
        description = 'Browse dashboard on Review Hub';
        break;
    }

    // 메타데이터 업데이트
    document.title = title;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    }
  }, [pathname]);

  return null;
}
