'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          password: password,
          name: formData.get('name'),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      const signInResult = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (signInResult?.error) {
        throw new Error(signInResult.error);
      }

      router.push('/onboarding');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-[#F5F2F2] to-[#F7E8E8]'>
      <nav className='bg-gradient-to-r from-[#E3BAB3] to-[#B76E79]'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            <Link href='/' className='flex items-center gap-2'>
              <Image
                src='/logo.webp'
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
              href='/login'
              className='inline-flex items-center px-4 py-2 text-sm font-medium text-[#800020] hover:bg-[#DCB1A7] hover:text-[#800020] rounded-md transition-all duration-200'
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      <div className='flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12'>
        <div className='w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-md border border-[#E3BAB3]'>
          <div className='text-center'>
            <h1 className='text-2xl font-bold text-[#800020]'>
              Create your account
            </h1>
          </div>

          <form onSubmit={handleSubmit} className='space-y-6'>
            {error && (
              <div className='p-3 text-sm text-red-500 bg-red-100 rounded'>
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor='name'
                className='block text-sm font-medium text-[#800020]'
              >
                Name
              </label>
              <input
                id='name'
                name='name'
                type='text'
                className='mt-1 block w-full rounded border border-[#E3BAB3] p-2 focus:border-[#800020] focus:ring-[#800020]'
                disabled={isLoading}
              />
            </div>

            <div>
              <label
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
              />
            </div>

            <div>
              <label
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
              />
            </div>

            <button
              type='submit'
              className='w-full rounded bg-[#800020] p-2 text-[#E3BAB3] hover:bg-[#a36c53] disabled:opacity-50 transition-colors duration-200'
              disabled={isLoading}
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </button>

            <p className='text-center text-sm text-[#4A4A4A]'>
              Already have an account?{' '}
              <Link href='/login' className='text-[#800020] hover:underline'>
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
