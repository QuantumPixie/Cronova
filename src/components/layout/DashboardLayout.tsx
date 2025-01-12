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
      <nav
        className='bg-gradient-to-r from-[#E3BAB3] to-[#B76E79] sticky top-0 z-50'
        aria-label='Main navigation'
      >
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between h-16'>
            <Link
              href='/dashboard'
              className='flex items-center gap-2 flex-shrink-0'
              aria-label='Go to dashboard home'
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

            <div
              className='hidden md:flex md:items-center md:space-x-4 flex-1 justify-center'
              role='navigation'
              aria-label='Desktop navigation'
            >
              {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    pathname === href
                      ? 'bg-[#800020] text-[#E3BAB3]'
                      : 'text-[#800020] hover:bg-[#DCB1A7]'
                  }`}
                  aria-current={pathname === href ? 'page' : undefined}
                >
                  <Icon className='w-4 h-4 mr-2' aria-hidden='true' />
                  {label}
                </Link>
              ))}
            </div>

            <div className='hidden md:flex items-center space-x-4'>
              <Link
                href='/dashboard/settings'
                className='inline-flex items-center px-4 py-2 text-sm font-medium text-[#800020] hover:bg-[#DCB1A7] rounded-md transition-all duration-200'
                aria-label='Settings'
              >
                <Settings className='w-4 h-4 mr-2' aria-hidden='true' />
                Settings
              </Link>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className='md:hidden inline-flex items-center justify-center p-2 rounded-md text-[#800020] hover:bg-[#DCB1A7]'
              aria-expanded={mobileMenuOpen}
              aria-controls='mobile-menu'
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? (
                <X className='block h-6 w-6' aria-hidden='true' />
              ) : (
                <Menu className='block h-6 w-6' aria-hidden='true' />
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div
            className='md:hidden border-t border-[#B76E79]'
            id='mobile-menu'
            role='navigation'
            aria-label='Mobile navigation'
          >
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
                  aria-current={pathname === href ? 'page' : undefined}
                >
                  <Icon className='w-4 h-4 mr-3' aria-hidden='true' />
                  {label}
                </Link>
              ))}
              <Link
                href='/settings'
                className='flex items-center px-3 py-2 rounded-md text-base font-medium text-[#800020] hover:bg-[#DCB1A7]'
                onClick={() => setMobileMenuOpen(false)}
                aria-label='Settings'
              >
                <Settings className='w-4 h-4 mr-3' aria-hidden='true' />
                Settings
              </Link>
            </div>
          </div>
        )}
      </nav>

      <main className='max-w-7xl mx-auto py-6 sm:px-6 lg:px-8' role='main'>
        <div className='px-4 sm:px-0'>{children}</div>
      </main>
    </div>
  );
}
