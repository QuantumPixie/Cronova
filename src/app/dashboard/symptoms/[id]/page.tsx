import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export default async function SymptomDetailPage(context: {
  params: { id: string };
}) {
  const { id } = await context.params;
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
    return null;
  }

  const symptom = await prisma.symptomEntry.findUnique({
    where: {
      id,
      userId: session.user.id,
    },
  });

  if (!symptom) {
    redirect('/dashboard/symptoms');
    return null;
  }

  return (
    <div className='p-6 max-w-2xl mx-auto'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Symptom Details</h1>
        <Link
          href='/dashboard/symptoms'
          className='text-blue-600 hover:underline'
        >
          Back to List
        </Link>
      </div>

      <div className='bg-white shadow rounded-lg p-6'>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <h2 className='font-medium text-gray-500'>Date</h2>
            <p>{symptom.date}</p>
          </div>
          <div>
            <h2 className='font-medium text-gray-500'>Overall Intensity</h2>
            <p className='capitalize'>{symptom.intensity.toLowerCase()}</p>
          </div>
          <div>
            <h2 className='font-medium text-gray-500'>Hot Flashes</h2>
            <p>{symptom.hotFlashes}/10</p>
          </div>
          <div>
            <h2 className='font-medium text-gray-500'>Night Sweats</h2>
            <p>{symptom.nightSweats}/10</p>
          </div>
          <div>
            <h2 className='font-medium text-gray-500'>Mood Swings</h2>
            <p>{symptom.moodSwings}/10</p>
          </div>
          <div>
            <h2 className='font-medium text-gray-500'>Sleep Issues</h2>
            <p>{symptom.sleepIssues}/10</p>
          </div>
          <div>
            <h2 className='font-medium text-gray-500'>Anxiety</h2>
            <p>{symptom.anxiety}/10</p>
          </div>
          <div>
            <h2 className='font-medium text-gray-500'>Fatigue</h2>
            <p>{symptom.fatigue}/10</p>
          </div>
        </div>

        {symptom.notes && (
          <div className='mt-6'>
            <h2 className='font-medium text-gray-500 mb-2'>Notes</h2>
            <p className='text-gray-700'>{symptom.notes}</p>
          </div>
        )}

        <div className='mt-6 text-sm text-gray-500'>
          <p>Created: {new Date(symptom.createdAt).toLocaleString()}</p>
          <p>Last Updated: {new Date(symptom.updatedAt).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
