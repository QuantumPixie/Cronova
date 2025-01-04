'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
    <div className='flex min-h-screen items-center justify-center'>
      <div className='w-full max-w-md space-y-8 p-6'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold'>Sign in to your account</h1>
        </div>

        <form onSubmit={handleSubmit} className='space-y-6'>
          {error && (
            <div className='p-3 text-sm text-red-500 bg-red-100 rounded'>
              {error}
            </div>
          )}

          <div>
            <label htmlFor='email' className='block text-sm font-medium'>
              Email
            </label>
            <input
              id='email'
              name='email'
              type='email'
              required
              className='mt-1 block w-full rounded border p-2'
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor='password' className='block text-sm font-medium'>
              Password
            </label>
            <input
              id='password'
              name='password'
              type='password'
              required
              className='mt-1 block w-full rounded border p-2'
              disabled={isLoading}
            />
          </div>

          <button
            type='submit'
            className='w-full rounded bg-blue-600 p-2 text-white hover:bg-blue-700 disabled:opacity-50'
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
