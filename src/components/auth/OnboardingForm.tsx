'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export function OnboardingForm() {
  const router = useRouter();
  const { data: session, update } = useSession();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    menopauseStage: '',
    lastPeriodDate: '',
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const payload: Record<string, unknown> = {};
      if (formData.menopauseStage)
        payload.menopauseStage = formData.menopauseStage;
      if (formData.lastPeriodDate)
        payload.lastPeriodDate = formData.lastPeriodDate;

      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save preferences');
      }

      await update();
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }

  const handleStageSelect = (value: string) => {
    setFormData((prev) => ({ ...prev, menopauseStage: value }));
    setStep(2);
  };

  if (!session) {
    return null;
  }

  return (
    <div className='max-w-md mx-auto p-6 bg-white rounded-lg shadow-md border border-[#E3BAB3]'>
      <h2 className='text-xl font-bold text-[#800020] mb-4'>
        Welcome to CroNova
      </h2>
      <p className='text-[#4A4A4A] mb-6'>
        Let&apos;s set up your profile to personalize your experience.
      </p>

      <form onSubmit={handleSubmit} className='space-y-6'>
        {error && (
          <div className='p-3 text-sm text-red-500 bg-red-100 rounded'>
            {error}
          </div>
        )}

        {step === 1 && (
          <div>
            <label
              htmlFor='menopauseStage'
              className='block text-sm font-medium text-[#800020]'
            >
              What stage are you in?
            </label>
            <select
              id='menopauseStage'
              name='menopauseStage'
              value={formData.menopauseStage}
              onChange={(e) => handleStageSelect(e.target.value)}
              className='mt-1 block w-full rounded border border-[#E3BAB3] p-2 focus:border-[#800020] focus:ring-[#800020]'
              required
            >
              <option value=''>Select a stage</option>
              <option value='PERIMENOPAUSE'>Perimenopause</option>
              <option value='MENOPAUSE'>Menopause</option>
              <option value='POSTMENOPAUSE'>Post-menopause</option>
            </select>
          </div>
        )}

        {step === 2 && (
          <div>
            <label
              htmlFor='lastPeriodDate'
              className='block text-sm font-medium text-[#800020]'
            >
              When was your last period?
            </label>
            <input
              type='date'
              id='lastPeriodDate'
              name='lastPeriodDate'
              value={formData.lastPeriodDate}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  lastPeriodDate: e.target.value,
                }))
              }
              className='mt-1 block w-full rounded border border-[#E3BAB3] p-2 focus:border-[#800020] focus:ring-[#800020]'
            />
            <button
              type='submit'
              disabled={isLoading}
              className='mt-4 w-full rounded bg-[#800020] px-4 py-2 text-[#E3BAB3] hover:bg-[#a36c53] disabled:opacity-50 transition-colors duration-200'
            >
              {isLoading ? 'Saving...' : 'Complete Setup'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
