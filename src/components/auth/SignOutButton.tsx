'use client';

import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';

export function SignOutButton() {
  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: '/' });
  };

  return (
    <button
      onClick={handleSignOut}
      className='flex items-center gap-2 px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors'
    >
      <LogOut className='w-4 h-4' />
      Sign Out
    </button>
  );
}
