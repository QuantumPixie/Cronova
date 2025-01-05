'use client';

import { useRouter } from 'next/navigation';
import { JournalForm } from '@/components/journal/JournalForm';
import type { JournalFormData } from '@/types/journal';

export default function NewJournalPage() {
  const router = useRouter();

  async function createJournalEntry(data: JournalFormData) {
    try {
      const response = await fetch('/api/journal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create journal entry');
      }

      const result = await response.json();

      if (result.success) {
        router.push('/dashboard/journal');
        router.refresh();
      }
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  return (
    <div className='p-6 max-w-2xl mx-auto'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold text-[#800020]'>New Journal Entry</h1>
      </div>
      <JournalForm onSubmit={createJournalEntry} />
    </div>
  );
}
