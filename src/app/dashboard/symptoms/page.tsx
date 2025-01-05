import Link from 'next/link';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export default async function SymptomsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const symptoms = await prisma.symptomEntry.findMany({
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
        <h1 className='text-2xl font-bold text-[#800020]'>Symptom Tracker</h1>
        <Link
          href='/dashboard/symptoms/new'
          className='px-4 py-2 bg-[#800020] text-[#E3BAB3] rounded hover:bg-[#a36c53] transition-colors duration-200'
        >
          Add New Entry
        </Link>
      </div>

      <div className='space-y-4'>
        {symptoms.map((symptom) => (
          <div
            key={symptom.id}
            className='border border-[#E3BAB3] rounded-lg p-4 hover:bg-[#F5F2F2] transition-colors duration-200'
          >
            <div className='flex justify-between items-start'>
              <div>
                <p className='font-medium text-[#4A4A4A]'>{symptom.date}</p>
                <p className='text-sm text-[#800020]'>
                  Intensity: {symptom.intensity.toLowerCase()}
                </p>
              </div>
              <Link
                href={`/dashboard/symptoms/${symptom.id}`}
                className='text-[#800020] hover:underline hover:text-[#B76E79] transition-colors duration-200'
              >
                View Details
              </Link>
            </div>
          </div>
        ))}

        {symptoms.length === 0 && (
          <p className='text-center text-[#4A4A4A] py-8'>
            No symptoms logged yet. Start tracking your symptoms to get
            insights.
          </p>
        )}
      </div>
    </div>
  );
}
