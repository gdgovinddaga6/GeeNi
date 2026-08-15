'use client';

import { SessionProvider } from 'next-auth/react';
import { features } from '@/lib/config/features';

export function AppProviders({ children }: { children: React.ReactNode }) {
  if (!features.googleAuth) {
    return children;
  }

  return <SessionProvider>{children}</SessionProvider>;
}
