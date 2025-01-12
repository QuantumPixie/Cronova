'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Calendar,
  BookOpen,
  LineChart,
  Home,
  Menu,
  X,
  Settings,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Overview', icon: Home },
  { href: '/dashboard/symptoms', label: 'Symptoms', icon: Calendar },
  { href: '/dashboard/journal', label: 'Journal', icon: BookOpen },
  { href: '/dashboard/insights', label: 'Insights', icon: LineChart },
  // { href: '/settings', label: 'Settings', icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className='min-h-screen bg-gradient-to-b from-[#F5F2F2] to-[#F7E8E8]'>
      <nav className='bg-gradient-to-r from-[#E3BAB3] to-[#B76E79] sticky top-0 z-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between h-16'>
            <Link
              href='/dashboard'
              className='flex items-center gap-2 flex-shrink-0'
            >
              <Image
                src='/croNova-logo.webp'
                alt='CroNova Logo'
                width={32}
                height={32}
                className='h-8 w-8'
              />
              <span className='text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#800020] to-[#a36c53]'>
                CroNova
              </span>
            </Link>

            <div className='hidden md:flex md:items-center md:space-x-4 flex-1 justify-center'>
              {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    pathname === href
                      ? 'bg-[#800020] text-[#E3BAB3]'
                      : 'text-[#800020] hover:bg-[#DCB1A7]'
                  }`}
                >
                  <Icon className='w-4 h-4 mr-2' />
                  {label}
                </Link>
              ))}
            </div>

            <div className='hidden md:flex items-center space-x-4'>
              <Link
                href='/dashboard/settings'
                className='inline-flex items-center px-4 py-2 text-sm font-medium text-[#800020] hover:bg-[#DCB1A7] rounded-md transition-all duration-200'
              >
                <Settings className='w-4 h-4 mr-2' />
                Settings
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className='md:hidden'>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className='inline-flex items-center justify-center p-2 rounded-md text-[#800020] hover:bg-[#DCB1A7]'
              >
                {mobileMenuOpen ? (
                  <X className='block h-6 w-6' />
                ) : (
                  <Menu className='block h-6 w-6' />
                )}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className='md:hidden border-t border-[#B76E79]'>
            <div className='px-2 pt-2 pb-3 space-y-1'>
              {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`${
                    pathname === href
                      ? 'bg-[#800020] text-[#E3BAB3]'
                      : 'text-[#800020] hover:bg-[#DCB1A7]'
                  } flex items-center px-3 py-2 rounded-md text-base font-medium`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon className='w-4 h-4 mr-3' />
                  {label}
                </Link>
              ))}
              <Link
                href='/settings'
                className='flex items-center px-3 py-2 rounded-md text-base font-medium text-[#800020] hover:bg-[#DCB1A7]'
                onClick={() => setMobileMenuOpen(false)}
              >
                <Settings className='w-4 h-4 mr-3' />
                Settings
              </Link>
            </div>
          </div>
        )}
      </nav>

      <main className='max-w-7xl mx-auto py-6 sm:px-6 lg:px-8'>
        <div className='px-4 sm:px-0'>{children}</div>
      </main>
    </div>
  );
}
