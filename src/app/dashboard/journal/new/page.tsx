'use client';

import { useRouter } from 'next/navigation';
import { JournalForm } from '@/components/journal/JournalForm';
import type { JournalFormData } from '@/types/journal';

export default function NewJournalPage() {
  const router = useRouter();

  async function createJournalEntry(data: JournalFormData) {
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

    router.push('/dashboard/journal');
    router.refresh();
  }

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-6'>New Journal Entry</h1>
      <JournalForm onSubmit={createJournalEntry} />
    </div>
  );
}
