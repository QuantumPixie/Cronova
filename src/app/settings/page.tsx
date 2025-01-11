'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          menopauseStage: formData.get('menopauseStage'),
          lastPeriodDate: formData.get('lastPeriodDate'),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update settings');
      }

      await update();
      setSuccess('Settings updated successfully');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className='p-6 max-w-2xl mx-auto'>
      <h1 className='text-2xl font-bold text-[#800020] mb-6'>Settings</h1>

      <form onSubmit={handleSubmit} className='space-y-6'>
        {error && (
          <div className='p-3 text-sm text-red-500 bg-red-100 rounded'>
            {error}
          </div>
        )}

        {success && (
          <div className='p-3 text-sm text-green-500 bg-green-100 rounded'>
            {success}
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
            defaultValue={session?.user?.name || ''}
            className='mt-1 block w-full rounded border border-[#E3BAB3] p-2 focus:border-[#800020] focus:ring-[#800020]'
          />
        </div>

        <div>
          <label
            htmlFor='menopauseStage'
            className='block text-sm font-medium text-[#800020]'
          >
            Menopause Stage
          </label>
          <select
            id='menopauseStage'
            name='menopauseStage'
            defaultValue={session?.user?.menopauseStage || 'PERIMENOPAUSE'}
            className='mt-1 block w-full rounded border border-[#E3BAB3] p-2 focus:border-[#800020] focus:ring-[#800020]'
          >
            <option value='PERIMENOPAUSE'>Perimenopause</option>
            <option value='MENOPAUSE'>Menopause</option>
            <option value='POSTMENOPAUSE'>Post-menopause</option>
          </select>
        </div>

        <div>
          <label
            htmlFor='lastPeriodDate'
            className='block text-sm font-medium text-[#800020]'
          >
            Last Period Date
          </label>
          <input
            id='lastPeriodDate'
            name='lastPeriodDate'
            type='date'
            className='mt-1 block w-full rounded border border-[#E3BAB3] p-2 focus:border-[#800020] focus:ring-[#800020]'
          />
        </div>

        <button
          type='submit'
          disabled={isLoading}
          className='w-full rounded bg-[#800020] px-4 py-2 text-[#E3BAB3] hover:bg-[#a36c53] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200'
        >
          {isLoading ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}
