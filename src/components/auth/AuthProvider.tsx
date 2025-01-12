'use client';

import { SessionProvider } from 'next-auth/react';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  return (
    <SessionProvider>
      <div role='main' aria-live='polite'>
        {children}
      </div>
    </SessionProvider>
  );
}
