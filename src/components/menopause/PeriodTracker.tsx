import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { formatPeriodDate } from '@/lib/services/menopause-service';

interface PeriodTrackerProps {
  lastPeriodDate: string | null;
  onUpdatePeriod: (date: string) => Promise<void>;
}

export function PeriodTracker({
  lastPeriodDate,
  onUpdatePeriod,
}: PeriodTrackerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNewPeriod = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const date = formData.get('periodDate') as string;

    try {
      await onUpdatePeriod(date);
      (event.target as HTMLFormElement).reset();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to update period date'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className='bg-white rounded-lg shadow-sm border border-[#E3BAB3] p-6'
      role='region'
      aria-label='Period Tracker'
    >
      <div className='flex items-center gap-2 mb-4'>
        <Calendar className='w-5 h-5 text-[#800020]' aria-hidden='true' />
        <h2 className='text-lg font-semibold text-[#800020]'>Period Tracker</h2>
      </div>

      <div className='space-y-6'>
        {lastPeriodDate && (
          <div role='status' aria-label='Last recorded period date'>
            <p className='text-[#4A4A4A]'>
              Last Recorded Period: {formatPeriodDate(lastPeriodDate)}
            </p>
          </div>
        )}

        <form onSubmit={handleNewPeriod} className='space-y-4'>
          {error && (
            <div
              className='p-3 text-sm text-red-500 bg-red-100 rounded'
              role='alert'
            >
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor='periodDate'
              className='block text-sm font-medium text-[#800020]'
            >
              Record New Period
            </label>
            <input
              type='date'
              id='periodDate'
              name='periodDate'
              max={new Date().toISOString().split('T')[0]}
              className='mt-1 block w-full rounded border border-[#E3BAB3] p-2 focus:border-[#800020] focus:ring-[#800020]'
              required
              aria-label='Select period date'
            />
          </div>

          <button
            type='submit'
            disabled={isLoading}
            className='w-full rounded bg-[#800020] px-4 py-2 text-[#E3BAB3] hover:bg-[#a36c53] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200'
            aria-disabled={isLoading}
          >
            {isLoading ? 'Recording...' : 'Record Period'}
          </button>
        </form>
      </div>
    </div>
  );
}
