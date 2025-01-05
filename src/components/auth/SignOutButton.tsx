'use client';

import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-[#E3BAB3] bg-[#800020] hover:bg-[#a36c53] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B76E79] transition-colors duration-200'
    >
      <LogOut className='w-4 h-4 mr-2' />
      Sign Out
    </button>
  );
}