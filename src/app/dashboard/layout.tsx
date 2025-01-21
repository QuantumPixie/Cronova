import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';

export default async function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return (
    <div role='main' aria-label='Dashboard layout'>
      <DashboardLayout>
        <ErrorBoundary>{children}</ErrorBoundary>
      </DashboardLayout>
    </div>
  );
}
