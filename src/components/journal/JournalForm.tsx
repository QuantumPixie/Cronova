'use client';

import { useState } from 'react';
import type { JournalFormData } from '@/types/journal';

interface JournalFormProps {
  onSubmit: (data: JournalFormData) => Promise<void>;
  initialData?: Partial<JournalFormData>;
}

const MOOD_OPTIONS = [
  { value: 'GREAT', label: 'Great' },
  { value: 'GOOD', label: 'Good' },
  { value: 'NEUTRAL', label: 'Neutral' },
  { value: 'LOW', label: 'Low' },
  { value: 'BAD', label: 'Bad' },
] as const;

export function JournalForm({ onSubmit, initialData }: JournalFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<JournalFormData>({
    date: initialData?.date ?? new Date().toISOString().split('T')[0],
    mood: initialData?.mood ?? 'NEUTRAL',
    sleep: initialData?.sleep ?? 0,
    exercise: initialData?.exercise ?? false,
    diet: initialData?.diet ?? [],
    stress: initialData?.stress ?? 0,
    notes: initialData?.notes ?? '',
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to save journal entry'
      );
    } finally {
      setIsLoading(false);
    }
  }

  const today = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      {error && (
        <div className='p-3 text-sm text-red-500 bg-red-100 rounded'>
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor='date'
          className='block text-sm font-medium text-gray-700'
        >
          Date
        </label>
        <input
          type='date'
          id='date'
          max={today}
          value={formData.date}
          onChange={(event) =>
            setFormData((prev) => ({
              ...prev,
              date: event.target.value,
            }))
          }
          className='mt-1 block w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500'
          required
        />
      </div>

      <div>
        <label
          htmlFor='mood'
          className='block text-sm font-medium text-gray-700'
        >
          Mood
        </label>
        <select
          id='mood'
          value={formData.mood}
          onChange={(event) =>
            setFormData((prev) => ({
              ...prev,
              mood: event.target.value as typeof formData.mood,
            }))
          }
          className='mt-1 block w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500'
          required
        >
          {MOOD_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor='sleep'
          className='block text-sm font-medium text-gray-700'
        >
          Hours of Sleep
        </label>
        <input
          type='number'
          id='sleep'
          min='0'
          max='24'
          value={formData.sleep}
          onChange={(event) =>
            setFormData((prev) => ({
              ...prev,
              sleep: Number(event.target.value),
            }))
          }
          className='mt-1 block w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500'
          required
        />
      </div>

      <div>
        <label className='flex items-center'>
          <input
            type='checkbox'
            checked={formData.exercise}
            onChange={(event) =>
              setFormData((prev) => ({
                ...prev,
                exercise: event.target.checked,
              }))
            }
            className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
          />
          <span className='ml-2 text-sm text-gray-700'>Exercise today?</span>
        </label>
      </div>

      <div>
        <label
          htmlFor='stress'
          className='block text-sm font-medium text-gray-700'
        >
          Stress Level (0-10)
        </label>
        <input
          type='number'
          id='stress'
          min='0'
          max='10'
          value={formData.stress}
          onChange={(event) =>
            setFormData((prev) => ({
              ...prev,
              stress: Number(event.target.value),
            }))
          }
          className='mt-1 block w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500'
        />
      </div>

      <div>
        <label
          htmlFor='notes'
          className='block text-sm font-medium text-gray-700'
        >
          Notes
        </label>
        <textarea
          id='notes'
          rows={3}
          value={formData.notes}
          onChange={(event) =>
            setFormData((prev) => ({
              ...prev,
              notes: event.target.value,
            }))
          }
          className='mt-1 block w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500'
          placeholder='Add any additional notes about your day...'
        />
      </div>

      <button
        type='submit'
        disabled={isLoading}
        className='w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
      >
        {isLoading ? 'Saving...' : 'Save Journal Entry'}
      </button>
    </form>
  );
}
