'use client';

import { useRouter } from 'next/navigation';
import { SymptomForm } from '@/components/symptoms/SymptomForm';
import type { SymptomFormData } from '@/types/symptoms';

export default function NewSymptomPage() {
  const router = useRouter();

  async function createSymptom(data: SymptomFormData) {
    try {
      console.log('Sending data:', data);

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
      console.log('Response:', result);

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
    <div className='p-6 max-w-2xl mx-auto'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold text-[#800020]'>Log New Symptoms</h1>
      </div>
      <SymptomForm onSubmit={createSymptom} />
    </div>
  );
}
