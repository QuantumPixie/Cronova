'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const RegisterPage: React.FC = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.get('email'),
          password: formData.get('password'),
          name: formData.get('name'),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      // If registration was successful, redirect to login
      router.push('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className='flex min-h-screen items-center justify-center'>
      <div className='w-full max-w-md space-y-8 p-6'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold'>Create your account</h1>
        </div>

        <form onSubmit={handleSubmit} className='space-y-6'>
          {error && (
            <div className='p-3 text-sm text-red-500 bg-red-100 rounded'>
              {error}
            </div>
          )}

          <div>
            <label htmlFor='name' className='block text-sm font-medium'>
              Name
            </label>
            <input
              id='name'
              name='name'
              type='text'
              className='mt-1 block w-full rounded border p-2'
              disabled={isLoading}
            />
          </div>

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
            {isLoading ? 'Creating account...' : 'Create account'}
          </button>

          <p className='text-center text-sm'>
            Already have an account?{' '}
            <a href='/login' className='text-blue-600 hover:underline'>
              Sign in
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
