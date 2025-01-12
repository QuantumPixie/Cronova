'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { MenopauseJourney } from '@/components/menopause/MenopauseJourney';
import { PeriodTracker } from '@/components/menopause/PeriodTracker';
import { MenopauseStage } from '@prisma/client';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface FormData {
  name: string;
  menopauseStage: MenopauseStage;
  lastPeriodDate: string;
  periodDates: string[];
}

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    name: session?.user?.name ?? '',
    menopauseStage:
      session?.user?.menopauseStage ?? MenopauseStage.PERIMENOPAUSE,
    lastPeriodDate: session?.user?.lastPeriodDate ?? '',
    periodDates: session?.user?.periodDates ?? [],
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
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

  async function handlePeriodUpdate(date: string) {
    setFormData((prev) => ({ ...prev, lastPeriodDate: date }));
    const response = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lastPeriodDate: date }),
    });

    if (!response.ok) {
      throw new Error('Failed to update period date');
    }

    await update();
    router.refresh();
  }

  function handleStageChange(stage: MenopauseStage) {
    setFormData((prev) => ({
      ...prev,
      menopauseStage: stage,
    }));
  }

  return (
    <div className='p-6 max-w-4xl mx-auto' role='main'>
      <div className='flex justify-between items-center mb-6' role='banner'>
        <h1 className='text-2xl font-bold text-[#800020]'>Profile Settings</h1>
        <Link
          href='/dashboard'
          className='inline-flex items-center px-4 py-2 text-[#800020] hover:bg-[#E3BAB3] rounded-md transition-all duration-200'
          aria-label='Return to dashboard'
        >
          <ArrowLeft className='w-4 h-4 mr-2' aria-hidden='true' />
          Back to Dashboard
        </Link>
      </div>
      <div
        className='grid grid-cols-1 md:grid-cols-2 gap-6'
        role='group'
        aria-label='Profile settings and tracking'
      >
        <div className='space-y-6'>
          <form
            onSubmit={handleSubmit}
            className='space-y-6'
            aria-label='Profile settings form'
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

            {success && (
              <div
                className='p-3 text-sm text-green-500 bg-green-100 rounded'
                role='alert'
                aria-live='polite'
              >
                {success}
              </div>
            )}

            <div role='group' aria-labelledby='name-label'>
              <label
                id='name-label'
                htmlFor='name'
                className='block text-sm font-medium text-[#800020]'
              >
                Name
              </label>
              <input
                id='name'
                name='name'
                type='text'
                value={formData.name}
                onChange={(event) =>
                  setFormData((prev) => ({ ...prev, name: event.target.value }))
                }
                className='mt-1 block w-full rounded border border-[#E3BAB3] p-2 focus:border-[#800020] focus:ring-[#800020]'
                aria-describedby={error ? 'settings-error' : undefined}
              />
            </div>

            <div role='group' aria-labelledby='stage-label'>
              <label
                id='stage-label'
                htmlFor='menopauseStage'
                className='block text-sm font-medium text-[#800020]'
              >
                Menopause Stage
              </label>
              <select
                id='menopauseStage'
                name='menopauseStage'
                value={formData.menopauseStage}
                onChange={(e) =>
                  handleStageChange(e.target.value as MenopauseStage)
                }
                className='mt-1 block w-full rounded border border-[#E3BAB3] p-2 focus:border-[#800020] focus:ring-[#800020]'
                aria-describedby={error ? 'settings-error' : undefined}
              >
                {[
                  MenopauseStage.PERIMENOPAUSE,
                  MenopauseStage.MENOPAUSE,
                  MenopauseStage.POSTMENOPAUSE,
                ].map((stage) => (
                  <option key={stage} value={stage}>
                    {stage.charAt(0) + stage.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
            </div>

            <button
              type='submit'
              disabled={isLoading}
              className='w-full rounded bg-[#800020] px-4 py-2 text-[#E3BAB3] hover:bg-[#a36c53] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200'
              aria-disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Settings'}
            </button>
          </form>
        </div>

        <div
          className='space-y-6'
          role='complementary'
          aria-label='Tracking information'
        >
          <MenopauseJourney
            lastPeriodDate={formData.lastPeriodDate}
            currentStage={formData.menopauseStage}
          />
          <PeriodTracker
            lastPeriodDate={formData.lastPeriodDate}
            onUpdatePeriod={handlePeriodUpdate}
          />
        </div>
      </div>
    </div>
  );
}
