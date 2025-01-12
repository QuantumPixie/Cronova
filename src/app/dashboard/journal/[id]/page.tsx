import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Smile, Moon, Star, Activity, Battery } from 'lucide-react';
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

  const getMoodIcon = () => {
    switch (entry.mood) {
      case 'GREAT':
        return <Star className='w-5 h-5 text-[#B76E79]' aria-hidden='true' />;
      case 'GOOD':
        return <Smile className='w-5 h-5 text-[#B76E79]' aria-hidden='true' />;
      case 'NEUTRAL':
        return (
          <Activity className='w-5 h-5 text-[#B76E79]' aria-hidden='true' />
        );
      case 'LOW':
        return <Moon className='w-5 h-5 text-[#B76E79]' aria-hidden='true' />;
      case 'BAD':
        return (
          <Battery className='w-5 h-5 text-[#B76E79]' aria-hidden='true' />
        );
      default:
        return null;
    }
  };

  return (
    <div className='p-6 max-w-2xl mx-auto'>
      <div className='flex justify-between items-center mb-6'>
        <Link
          href='/dashboard/journal'
          className='inline-flex items-center text-[#800020] hover:text-[#a36c53] transition-colors duration-200'
          aria-label='Back to journal entries'
        >
          <ArrowLeft className='w-4 h-4 mr-2' aria-hidden='true' />
          Back to Journal
        </Link>
      </div>

      <article
        className='bg-white shadow-sm rounded-lg p-6 border border-[#E3BAB3]'
        role='article'
        aria-labelledby='journal-entry-date'
      >
        <div className='flex justify-between items-center mb-6'>
          <div>
            <h2
              className='text-sm font-medium text-[#800020]'
              id='journal-entry-date'
            >
              Date
            </h2>
            <p className='mt-1 text-[#4A4A4A]'>{entry.date}</p>
          </div>
          <div
            className='flex items-center gap-2'
            role='status'
            aria-label={`Mood: ${entry.mood.toLowerCase()}`}
          >
            {getMoodIcon()}
            <span className='text-sm font-medium text-[#4A4A4A]'>
              {entry.mood.toLowerCase()}
            </span>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div
            className='flex items-start gap-3 p-4 rounded-lg bg-gradient-to-r from-[#F5F2F2] to-[#F7E8E8]'
            role='region'
            aria-label='Sleep information'
          >
            <Moon className='w-5 h-5 text-[#B76E79]' aria-hidden='true' />
            <div>
              <h2 className='text-sm font-medium text-[#800020]'>Sleep</h2>
              <p className='mt-1 text-[#4A4A4A]'>{entry.sleep} hours</p>
            </div>
          </div>

          <div
            className='flex items-start gap-3 p-4 rounded-lg bg-gradient-to-r from-[#F5F2F2] to-[#F7E8E8]'
            role='region'
            aria-label='Exercise information'
          >
            <Activity className='w-5 h-5 text-[#B76E79]' aria-hidden='true' />
            <div>
              <h2 className='text-sm font-medium text-[#800020]'>Exercise</h2>
              <p className='mt-1 text-[#4A4A4A]'>
                {entry.exercise ? 'Yes' : 'No'}
              </p>
            </div>
          </div>

          {entry.diet && entry.diet.length > 0 && (
            <div
              className='flex items-start gap-3 p-4 rounded-lg bg-gradient-to-r from-[#F5F2F2] to-[#F7E8E8]'
              role='region'
              aria-label='Diet information'
            >
              <Smile className='w-5 h-5 text-[#B76E79]' aria-hidden='true' />
              <div>
                <h2 className='text-sm font-medium text-[#800020]'>Diet</h2>
                <p className='mt-1 text-[#4A4A4A]'>{entry.diet.join(', ')}</p>
              </div>
            </div>
          )}

          <div
            className='flex items-start gap-3 p-4 rounded-lg bg-gradient-to-r from-[#F5F2F2] to-[#F7E8E8]'
            role='region'
            aria-label='Stress level'
          >
            <Battery className='w-5 h-5 text-[#B76E79]' aria-hidden='true' />
            <div>
              <h2 className='text-sm font-medium text-[#800020]'>Stress</h2>
              <p className='mt-1 text-[#4A4A4A]'>{entry.stress}/10</p>
            </div>
          </div>
        </div>

        {entry.notes && (
          <div
            className='mt-6 pt-6 border-t border-[#E3BAB3]'
            role='region'
            aria-label='Additional notes'
          >
            <h2 className='text-sm font-medium text-[#800020] mb-2'>Notes</h2>
            <p className='text-[#4A4A4A] whitespace-pre-wrap'>{entry.notes}</p>
          </div>
        )}

        <div
          className='mt-6 pt-6 border-t border-[#E3BAB3] text-sm text-[#4A4A4A]'
          role='contentinfo'
          aria-label='Entry timestamps'
        >
          <p>Created: {new Date(entry.createdAt).toLocaleString()}</p>
          <p>Last Updated: {new Date(entry.updatedAt).toLocaleString()}</p>
        </div>
      </article>
    </div>
  );
}
