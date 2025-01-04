import Link from 'next/link';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export default async function JournalPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const entries = await prisma.journalEntry.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      date: 'desc',
    },
  });

  return (
    <div className='p-6 max-w-4xl mx-auto'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Journal Entries</h1>
        <Link
          href='/dashboard/journal/new'
          className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
        >
          New Entry
        </Link>
      </div>

      <div className='space-y-4'>
        {entries.map((entry) => (
          <div
            key={entry.id}
            className='border rounded-lg p-4 hover:bg-gray-50'
          >
            <div className='flex justify-between items-start'>
              <div>
                <p className='font-medium'>{entry.date}</p>
                <p className='text-sm text-gray-600'>
                  Mood: {entry.mood.toLowerCase()}
                </p>
                {entry.exercise && (
                  <span className='text-sm text-green-600'>🏃 Exercised</span>
                )}
              </div>
              <Link
                href={`/dashboard/journal/${entry.id}`}
                className='text-blue-600 hover:underline'
              >
                View Details
              </Link>
            </div>
          </div>
        ))}

        {entries.length === 0 && (
          <p className='text-center text-gray-500 py-8'>
            No journal entries yet. Start journaling to track your journey.
          </p>
        )}
      </div>
    </div>
  );
}
