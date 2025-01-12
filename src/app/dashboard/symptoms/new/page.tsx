'use client';

import { useRouter } from 'next/navigation';
import { SymptomForm } from '@/components/symptoms/SymptomForm';
import type { SymptomFormData } from '@/types/symptoms';

export default function NewSymptomPage() {
  const router = useRouter();

  async function createSymptom(data: SymptomFormData) {
    try {
      const response = await fetch('/api/symptoms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to save symptom');
      }

      const result = await response.json();

      if (result.success) {
        router.push('/dashboard/symptoms');
        router.refresh();
      }
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  return (
    <div className='p-6 max-w-2xl mx-auto' role='main'>
      <div className='flex justify-between items-center mb-6' role='banner'>
        <h1 className='text-2xl font-bold text-[#800020]' id='page-title'>
          Log New Symptoms
        </h1>
      </div>
      <div role='form' aria-labelledby='page-title'>
        <SymptomForm onSubmit={createSymptom} />
      </div>
    </div>
  );
}