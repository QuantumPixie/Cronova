import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { Calendar, BookOpen, LineChart } from 'lucide-react';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { SignOutButton } from '@/components/auth/SignOutButton';
import DashboardCard from '@/components/shared/DashboardCard';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const [symptomsCount, journalCount] = await Promise.all([
    prisma.symptomEntry.count({
      where: { userId: session.user.id },
    }),
    prisma.journalEntry.count({
      where: { userId: session.user.id },
    }),
  ]);

  return (
    <div className='space-y-8'>
      <div className='bg-white shadow-sm border border-[#E8D8EE] rounded-lg p-6'>
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
          <div>
            <h1 className='text-2xl font-bold text-[#584B6C]'>Welcome Back!</h1>
            <p className='mt-1 text-gray-500'>
              {session.user.name || session.user.email}
            </p>
          </div>
          <SignOutButton />
        </div>
      </div>

      <div>
        <h2 className='text-lg font-semibold text-[#584B6C] mb-4'>
          Quick Actions
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          <DashboardCard
            title='Track Symptoms'
            description='Monitor and log your daily symptoms to track patterns over time'
            href='/dashboard/symptoms/new'
            icon={Calendar}
            stats={{
              label: 'Total Entries',
              value: symptomsCount,
            }}
          />

          <DashboardCard
            title='Journal Entry'
            description='Record your thoughts, moods, and daily experiences'
            href='/dashboard/journal/new'
            icon={BookOpen}
            stats={{
              label: 'Total Entries',
              value: journalCount,
            }}
          />

          <DashboardCard
            title='View Insights'
            description='Get personalized insights based on your tracked data'
            href='/dashboard/insights'
            icon={LineChart}
          />
        </div>
      </div>
    </div>
  );
}
