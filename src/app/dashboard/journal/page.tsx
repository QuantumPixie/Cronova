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
    <div className='p-6 max-w-4xl mx-auto' role='main'>
      <div className='flex justify-between items-center mb-6' role='banner'>
        <h1 className='text-2xl font-bold text-[#800020]'>Journal Entries</h1>
        <Link
          href='/dashboard/journal/new'
          className='px-4 py-2 bg-[#800020] text-[#E3BAB3] rounded hover:bg-[#a36c53] transition-colors duration-200'
          aria-label='Create new journal entry'
        >
          Add New Entry
        </Link>
      </div>

      <div className='space-y-4' role='feed' aria-label='Journal entries list'>
        {entries.map((entry) => (
          <article
            key={entry.id}
            className='border border-[#E3BAB3] rounded-lg p-4 hover:bg-[#F5F2F2] transition-colors duration-200'
            aria-labelledby={`journal-date-${entry.id}`}
          >
            <div className='flex justify-between items-start'>
              <div>
                <p
                  id={`journal-date-${entry.id}`}
                  className='font-medium text-[#4A4A4A]'
                >
                  {entry.date}
                </p>
                <p
                  className='text-sm text-[#800020]'
                  aria-label={`Mood: ${entry.mood.toLowerCase()}`}
                >
                  Mood: {entry.mood.toLowerCase()}
                </p>
              </div>
              <Link
                href={`/dashboard/journal/${entry.id}`}
                className='text-[#800020] hover:underline hover:text-[#B76E79] transition-colors duration-200'
                aria-label={`View details for journal entry from ${entry.date}`}
              >
                View Details
              </Link>
            </div>
          </article>
        ))}

        {entries.length === 0 && (
          <div
            className='text-center text-[#4A4A4A] py-8'
            role='status'
            aria-label='No journal entries'
          >
            <p>
              No journal entries yet. Start documenting your journey to track
              your progress.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
