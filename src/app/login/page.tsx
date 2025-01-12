'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);

    try {
      const response = await signIn('credentials', {
        email: formData.get('email'),
        password: formData.get('password'),
        redirect: false,
      });

      if (response?.error) {
        setError(response.error);
        return;
      }

      if (response?.ok) {
        router.push('/dashboard');
        router.refresh();
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setError('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-[#F5F2F2] to-[#F7E8E8]'>
      <nav
        className='bg-gradient-to-r from-[#E3BAB3] to-[#B76E79]'
        role='navigation'
        aria-label='Main navigation'
      >
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            <Link
              href='/'
              className='flex items-center gap-2'
              aria-label='Return to homepage'
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
            <Link
              href='/register'
              className='inline-flex items-center px-4 py-2 text-sm font-medium text-[#800020] hover:bg-[#DCB1A7] hover:text-[#800020] rounded-md transition-all duration-200'
              aria-label='Create new account'
            >
              Create Account
            </Link>
          </div>
        </div>
      </nav>

      <main className='flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12'>
        <div
          className='w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-md border border-[#E3BAB3]'
          role='region'
          aria-label='Login form'
        >
          <div className='text-center'>
            <h1 className='text-2xl font-bold text-[#800020]'>
              Sign in to your account
            </h1>
          </div>

          <form
            onSubmit={handleSubmit}
            className='space-y-6'
            aria-label='Sign in form'
          >
            {error && (
              <div
                className='p-3 text-sm text-red-500 bg-red-100 rounded'
                role='alert'
                aria-live='polite'
              >
                {error}
              </div>
            )}

            <div role='group' aria-labelledby='email-label'>
              <label
                id='email-label'
                htmlFor='email'
                className='block text-sm font-medium text-[#800020]'
              >
                Email
              </label>
              <input
                id='email'
                name='email'
                type='email'
                required
                className='mt-1 block w-full rounded border border-[#E3BAB3] p-2 focus:border-[#800020] focus:ring-[#800020]'
                disabled={isLoading}
                aria-required='true'
                aria-describedby={error ? 'login-error' : undefined}
              />
            </div>

            <div role='group' aria-labelledby='password-label'>
              <label
                id='password-label'
                htmlFor='password'
                className='block text-sm font-medium text-[#800020]'
              >
                Password
              </label>
              <input
                id='password'
                name='password'
                type='password'
                required
                className='mt-1 block w-full rounded border border-[#E3BAB3] p-2 focus:border-[#800020] focus:ring-[#800020]'
                disabled={isLoading}
                aria-required='true'
                aria-describedby={error ? 'login-error' : undefined}
              />
            </div>

            <button
              type='submit'
              className='w-full rounded bg-[#800020] p-2 text-[#E3BAB3] hover:bg-[#a36c53] disabled:opacity-50 transition-colors duration-200'
              disabled={isLoading}
              aria-disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>

            <p
              className='text-center text-sm text-[#4A4A4A]'
              role='contentinfo'
            >
              Don&apos;t have an account?{' '}
              <Link href='/register' className='text-[#800020] hover:underline'>
                Create one
              </Link>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}
