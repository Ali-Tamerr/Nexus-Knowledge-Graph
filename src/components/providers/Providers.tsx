'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { ToastProvider } from '@/context/ToastContext';
import { SessionProvider } from './SessionProvider';
import { AuthSync } from '../auth/AuthSync';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <AuthSync />
          {children}
        </ToastProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
