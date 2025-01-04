import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import { SignOutButton } from '@/components/auth/SignOutButton';

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return (
    <div className='p-6'>
      <div className='flex justify-between items-center mb-6'>
        <div>
          <h1 className='text-2xl font-bold'>Your Dashboard</h1>
          <p className='text-gray-600'>
            Welcome back, {session.user.name || session.user.email}
          </p>
        </div>
        <SignOutButton />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        <Link
          href='/dashboard/symptoms'
          className='block p-6 border rounded-lg hover:bg-gray-50 transition-colors'
        >
          <h2 className='text-lg font-semibold mb-2'>Symptom Tracker</h2>
          <p className='text-gray-600'>
            Track and monitor your symptoms over time
          </p>
        </Link>

        <Link
          href='/dashboard/journal'
          className='block p-6 border rounded-lg hover:bg-gray-50 transition-colors'
        >
          <h2 className='text-lg font-semibold mb-2'>Journal</h2>
          <p className='text-gray-600'>
            Record your daily experiences and moods
          </p>
        </Link>

        <Link
          href='/dashboard/insights'
          className='block p-6 border rounded-lg hover:bg-gray-50 transition-colors'
        >
          <h2 className='text-lg font-semibold mb-2'>Insights</h2>
          <p className='text-gray-600'>
            View personalized insights and recommendations
          </p>
        </Link>
      </div>
    </div>
  );
}
