import React, { useState } from 'react';
import { Calendar, Clock, Check } from 'lucide-react';
import { format, parseISO, differenceInDays } from 'date-fns';

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
  const [success, setSuccess] = useState(false);

  async function handleNewPeriod(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(event.currentTarget);
    const date = formData.get('periodDate') as string;

    try {
      await onUpdatePeriod(date);
      setSuccess(true);
      (event.target as HTMLFormElement).reset();

      // Reset success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to update period date'
      );
    } finally {
      setIsLoading(false);
    }
  }

  const getTimeSinceLastPeriod = () => {
    if (!lastPeriodDate) return null;
    const days = differenceInDays(new Date(), parseISO(lastPeriodDate));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return `${days} days ago`;
  };

  return (
    <div className='bg-white rounded-lg border border-[#E3BAB3] overflow-hidden'>
      {/* Header */}
      <div className='p-4 border-b border-[#E3BAB3] bg-gradient-to-r from-[#F5F2F2] to-[#F7E8E8]'>
        <div className='flex items-center gap-2'>
          <Calendar className='w-5 h-5 text-[#800020]' aria-hidden='true' />
          <h2 className='text-lg font-semibold text-[#800020]'>
            Period Tracker
          </h2>
        </div>
      </div>

      <div className='p-4 space-y-6'>
        {/* Last Period Info */}
        {lastPeriodDate && (
          <div className='flex items-start gap-4 p-4 bg-[#F5F2F2] rounded-lg'>
            <Clock className='w-5 h-5 text-[#B76E79] mt-1' aria-hidden='true' />
            <div>
              <p className='text-sm font-medium text-[#800020]'>Last Period</p>
              <p className='text-[#4A4A4A] mt-1'>
                {format(parseISO(lastPeriodDate), 'MMMM d, yyyy')}
              </p>
              <p className='text-sm text-[#B76E79] mt-1'>
                {getTimeSinceLastPeriod()}
              </p>
            </div>
          </div>
        )}

        {/* Record New Period Form */}
        <form onSubmit={handleNewPeriod} className='space-y-4'>
          {error && (
            <div
              className='p-3 text-sm text-red-500 bg-red-100 rounded flex items-center gap-2'
              role='alert'
            >
              <span className='inline-block w-2 h-2 rounded-full bg-red-500' />
              {error}
            </div>
          )}

          {success && (
            <div
              className='p-3 text-sm text-green-600 bg-green-100 rounded flex items-center gap-2'
              role='alert'
            >
              <Check className='w-4 h-4' aria-hidden='true' />
              Period date updated successfully
            </div>
          )}

          <div className='space-y-2'>
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
              className='w-full rounded border border-[#E3BAB3] p-3 focus:border-[#800020] focus:ring-[#800020] bg-white text-[#4A4A4A]'
              required
              aria-label='Select period date'
            />
          </div>

          <button
            type='submit'
            disabled={isLoading}
            className='w-full rounded bg-[#800020] px-4 py-3 text-[#E3BAB3] hover:bg-[#a36c53] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2'
            aria-disabled={isLoading}
          >
            <Calendar className='w-4 h-4' aria-hidden='true' />
            {isLoading ? 'Recording...' : 'Record Period'}
          </button>
        </form>

        {/* Tips Section */}
        <div className='text-sm text-[#4A4A4A] p-4 bg-[#F5F2F2] rounded-lg'>
          <h3 className='font-medium text-[#800020] mb-2'>Tracking Tips</h3>
          <ul className='space-y-2'>
            <li className='flex items-start gap-2'>
              <span className='inline-block w-2 h-2 rounded-full bg-[#B76E79] mt-2' />
              Record your period start date for accurate cycle tracking
            </li>
            <li className='flex items-start gap-2'>
              <span className='inline-block w-2 h-2 rounded-full bg-[#B76E79] mt-2' />
              Consistent tracking helps identify patterns and changes
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
