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
    <div className='p-6 max-w-4xl mx-auto' role='main'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold text-[#800020]'>Symptom Tracker</h1>
        <Link
          href='/dashboard/symptoms/new'
          className='px-4 py-2 bg-[#800020] text-[#E3BAB3] rounded hover:bg-[#a36c53] transition-colors duration-200'
          aria-label='Add new symptom entry'
        >
          Add New Entry
        </Link>
      </div>

      <div className='space-y-4' role='feed' aria-label='Symptom entries list'>
        {symptoms.map((symptom) => (
          <article
            key={symptom.id}
            className='border border-[#E3BAB3] rounded-lg p-4 hover:bg-[#F5F2F2] transition-colors duration-200'
            aria-labelledby={`symptom-date-${symptom.id}`}
          >
            <div className='flex justify-between items-start'>
              <div>
                <p
                  id={`symptom-date-${symptom.id}`}
                  className='font-medium text-[#4A4A4A]'
                >
                  {symptom.date}
                </p>
                <p
                  className='text-sm text-[#800020]'
                  aria-label={`Intensity level: ${symptom.intensity.toLowerCase()}`}
                >
                  Intensity: {symptom.intensity.toLowerCase()}
                </p>
              </div>
              <Link
                href={`/dashboard/symptoms/${symptom.id}`}
                className='text-[#800020] hover:underline hover:text-[#B76E79] transition-colors duration-200'
                aria-label={`View details for symptom entry from ${symptom.date}`}
              >
                View Details
              </Link>
            </div>
          </article>
        ))}

        {symptoms.length === 0 && (
          <div
            className='text-center text-[#4A4A4A] py-8'
            role='status'
            aria-label='No symptoms logged'
          >
            <p>
              No symptoms logged yet. Start tracking your symptoms to get
              insights.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
