// app/dashboard/page.tsx
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
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
      {/* dashboard content will go here */}
    </div>
  );
}
