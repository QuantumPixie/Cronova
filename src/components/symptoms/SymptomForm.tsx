'use client';

import { useState } from 'react';
import type { SymptomFormData } from '@/types/symptoms';

interface SymptomFormProps {
  onSubmit: (data: SymptomFormData) => Promise<void>;
  initialData?: Partial<SymptomFormData>;
}

const SYMPTOM_FIELDS = [
  { name: 'hotFlashes', label: 'Hot Flashes' },
  { name: 'nightSweats', label: 'Night Sweats' },
  { name: 'moodSwings', label: 'Mood Swings' },
  { name: 'sleepIssues', label: 'Sleep Issues' },
  { name: 'anxiety', label: 'Anxiety' },
  { name: 'fatigue', label: 'Fatigue' },
] as const;

const INTENSITY_OPTIONS = [
  { value: 'MILD', label: 'Mild' },
  { value: 'MODERATE', label: 'Moderate' },
  { value: 'SEVERE', label: 'Severe' },
] as const;

export function SymptomForm({ onSubmit, initialData }: SymptomFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<SymptomFormData>({
    date: initialData?.date ?? new Date().toISOString().split('T')[0],
    hotFlashes: initialData?.hotFlashes ?? 0,
    nightSweats: initialData?.nightSweats ?? 0,
    moodSwings: initialData?.moodSwings ?? 0,
    sleepIssues: initialData?.sleepIssues ?? 0,
    anxiety: initialData?.anxiety ?? 0,
    fatigue: initialData?.fatigue ?? 0,
    intensity: initialData?.intensity ?? 'MODERATE',
    notes: initialData?.notes ?? '',
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save symptoms');
    } finally {
      setIsLoading(false);
    }
  }

  const today = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit} className='max-w-2xl mx-auto space-y-6'>
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
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              date: e.target.value,
            }))
          }
          className='mt-1 block w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500'
          required
        />
      </div>

      {SYMPTOM_FIELDS.map(({ name, label }) => (
        <div key={name}>
          <label
            htmlFor={name}
            className='block text-sm font-medium text-gray-700'
          >
            {label} (0-10)
          </label>
          <input
            type='number'
            id={name}
            min='0'
            max='10'
            value={formData[name as keyof typeof formData]}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                [name]: Number(e.target.value),
              }))
            }
            className='mt-1 block w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500'
            required
          />
        </div>
      ))}

      <div>
        <label
          htmlFor='intensity'
          className='block text-sm font-medium text-gray-700'
        >
          Overall Intensity
        </label>
        <select
          id='intensity'
          value={formData.intensity}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              intensity: e.target.value as 'MILD' | 'MODERATE' | 'SEVERE',
            }))
          }
          className='mt-1 block w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500'
          required
        >
          {INTENSITY_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
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
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              notes: e.target.value,
            }))
          }
          className='mt-1 block w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500'
          placeholder='Add any additional notes about your symptoms...'
        />
      </div>

      <button
        type='submit'
        disabled={isLoading}
        className='w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
      >
        {isLoading ? 'Saving...' : 'Save Symptoms'}
      </button>
    </form>
  );
}
