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
    <form
      onSubmit={handleSubmit}
      className='max-w-2xl mx-auto space-y-6 bg-white p-6 rounded-lg shadow-md border border-[#E3BAB3] sm:p-8'
      aria-label='Symptom Entry Form'
      role='form'
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

      <div role='group' aria-labelledby='date-label'>
        <label
          id='date-label'
          htmlFor='date'
          className='block text-sm font-medium text-[#800020]'
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
          className='mt-1 block w-full rounded border border-[#E3BAB3] p-2 focus:border-[#800020] focus:ring-[#800020] bg-white'
          required
          aria-required='true'
        />
      </div>

      {SYMPTOM_FIELDS.map(({ name, label }) => (
        <div key={name} role='group' aria-labelledby={`${name}-label`}>
          <label
            id={`${name}-label`}
            htmlFor={name}
            className='block text-sm font-medium text-[#800020]'
          >
            {label} (0-10)
          </label>
          <input
            type='number'
            id={name}
            min='0'
            max='10'
            value={formData[name as keyof typeof formData]}
            onChange={(event) =>
              setFormData((prev) => ({
                ...prev,
                [name]: Number(event.target.value),
              }))
            }
            className='mt-1 block w-full rounded border border-[#E3BAB3] p-2 focus:border-[#800020] focus:ring-[#800020] bg-white'
            required
            aria-required='true'
          />
        </div>
      ))}

      <div role='group' aria-labelledby='intensity-label'>
        <label
          id='intensity-label'
          htmlFor='intensity'
          className='block text-sm font-medium text-[#800020]'
        >
          Overall Intensity
        </label>
        <select
          id='intensity'
          value={formData.intensity}
          onChange={(event) =>
            setFormData((prev) => ({
              ...prev,
              intensity: event.target.value as 'MILD' | 'MODERATE' | 'SEVERE',
            }))
          }
          className='mt-1 block w-full rounded border border-[#E3BAB3] p-2 focus:border-[#800020] focus:ring-[#800020] bg-white'
          required
          aria-required='true'
        >
          {INTENSITY_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div role='group' aria-labelledby='notes-label'>
        <label
          id='notes-label'
          htmlFor='notes'
          className='block text-sm font-medium text-[#800020]'
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
          className='mt-1 block w-full rounded border border-[#E3BAB3] p-2 focus:border-[#800020] focus:ring-[#800020] bg-white'
          placeholder='Add any additional notes about your symptoms...'
          aria-label='Additional notes about your symptoms'
        />
      </div>

      <button
        type='submit'
        disabled={isLoading}
        className='w-full rounded bg-[#800020] px-4 py-2 text-[#E3BAB3] hover:bg-[#a36c53] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200'
        aria-disabled={isLoading}
      >
        {isLoading ? 'Saving...' : 'Save Symptoms'}
      </button>
    </form>
  );
}