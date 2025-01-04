import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export default async function JournalDetailPage(context: {
  params: { id: string };
}) {
  const { id } = await context.params;
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const entry = await prisma.journalEntry.findUnique({
    where: {
      id,
      userId: session.user.id,
    },
  });

  if (!entry) {
    redirect('/dashboard/journal');
  }

  return (
    <div className='p-6 max-w-2xl mx-auto'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Journal Entry</h1>
        <Link
          href='/dashboard/journal'
          className='text-blue-600 hover:underline'
        >
          Back to Journal
        </Link>
      </div>

      <div className='bg-white shadow rounded-lg p-6'>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <h2 className='font-medium text-gray-500'>Date</h2>
            <p>{entry.date}</p>
          </div>
          <div>
            <h2 className='font-medium text-gray-500'>Mood</h2>
            <p className='capitalize'>{entry.mood.toLowerCase()}</p>
          </div>
          <div>
            <h2 className='font-medium text-gray-500'>Sleep</h2>
            <p>{entry.sleep} hours</p>
          </div>
          <div>
            <h2 className='font-medium text-gray-500'>Exercise</h2>
            <p>{entry.exercise ? 'Yes' : 'No'}</p>
          </div>
          <div>
            <h2 className='font-medium text-gray-500'>Stress Level</h2>
            <p>{entry.stress}/10</p>
          </div>
        </div>

        {entry.notes && (
          <div className='mt-6'>
            <h2 className='font-medium text-gray-500 mb-2'>Notes</h2>
            <p className='text-gray-700'>{entry.notes}</p>
          </div>
        )}

        <div className='mt-6 text-sm text-gray-500'>
          <p>Created: {new Date(entry.createdAt).toLocaleString()}</p>
          <p>Last Updated: {new Date(entry.updatedAt).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
