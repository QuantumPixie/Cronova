import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Thermometer,
  Moon,
  CloudRain,
  Heart,
  Brain,
  Battery,
} from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export default async function SymptomDetailPage(context: {
  params: { id: string };
}) {
  const { id } = await context.params;
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const symptom = await prisma.symptomEntry.findUnique({
    where: {
      id,
      userId: session.user.id,
    },
  });

  if (!symptom) {
    redirect('/dashboard/symptoms');
  }

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'MILD':
        return 'bg-[#E3BAB3] text-[#800020]';
      case 'MODERATE':
        return 'bg-[#B76E79] text-white';
      case 'SEVERE':
        return 'bg-[#800020] text-white';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className='p-6 max-w-2xl mx-auto'>
      <div className='flex justify-between items-center mb-6'>
        <Link
          href='/dashboard/symptoms'
          className='inline-flex items-center text-[#800020] hover:text-[#a36c53] transition-colors duration-200'
        >
          <ArrowLeft className='w-4 h-4 mr-2' />
          Back to Symptoms
        </Link>
      </div>

      <div className='bg-white shadow-sm rounded-lg p-6 border border-[#E3BAB3]'>
        <div className='flex justify-between items-center mb-6'>
          <div>
            <h2 className='text-sm font-medium text-[#800020]'>Date</h2>
            <p className='mt-1 text-[#4A4A4A]'>{symptom.date}</p>
          </div>
          <span
            className={`px-4 py-1.5 rounded-full text-sm font-medium ${getIntensityColor(
              symptom.intensity
            )}`}
          >
            {symptom.intensity.toLowerCase()}
          </span>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='flex items-start gap-3 p-4 rounded-lg bg-gradient-to-r from-[#F5F2F2] to-[#F7E8E8]'>
            <Thermometer className='w-5 h-5 text-[#B76E79]' />
            <div>
              <h2 className='text-sm font-medium text-[#800020]'>
                Hot Flashes
              </h2>
              <p className='mt-1 text-[#4A4A4A]'>{symptom.hotFlashes}/10</p>
            </div>
          </div>

          <div className='flex items-start gap-3 p-4 rounded-lg bg-gradient-to-r from-[#F5F2F2] to-[#F7E8E8]'>
            <CloudRain className='w-5 h-5 text-[#B76E79]' />
            <div>
              <h2 className='text-sm font-medium text-[#800020]'>
                Night Sweats
              </h2>
              <p className='mt-1 text-[#4A4A4A]'>{symptom.nightSweats}/10</p>
            </div>
          </div>

          <div className='flex items-start gap-3 p-4 rounded-lg bg-gradient-to-r from-[#F5F2F2] to-[#F7E8E8]'>
            <Heart className='w-5 h-5 text-[#B76E79]' />
            <div>
              <h2 className='text-sm font-medium text-[#800020]'>
                Mood Swings
              </h2>
              <p className='mt-1 text-[#4A4A4A]'>{symptom.moodSwings}/10</p>
            </div>
          </div>

          <div className='flex items-start gap-3 p-4 rounded-lg bg-gradient-to-r from-[#F5F2F2] to-[#F7E8E8]'>
            <Moon className='w-5 h-5 text-[#B76E79]' />
            <div>
              <h2 className='text-sm font-medium text-[#800020]'>
                Sleep Issues
              </h2>
              <p className='mt-1 text-[#4A4A4A]'>{symptom.sleepIssues}/10</p>
            </div>
          </div>

          <div className='flex items-start gap-3 p-4 rounded-lg bg-gradient-to-r from-[#F5F2F2] to-[#F7E8E8]'>
            <Brain className='w-5 h-5 text-[#B76E79]' />
            <div>
              <h2 className='text-sm font-medium text-[#800020]'>Anxiety</h2>
              <p className='mt-1 text-[#4A4A4A]'>{symptom.anxiety}/10</p>
            </div>
          </div>

          <div className='flex items-start gap-3 p-4 rounded-lg bg-gradient-to-r from-[#F5F2F2] to-[#F7E8E8]'>
            <Battery className='w-5 h-5 text-[#B76E79]' />
            <div>
              <h2 className='text-sm font-medium text-[#800020]'>Fatigue</h2>
              <p className='mt-1 text-[#4A4A4A]'>{symptom.fatigue}/10</p>
            </div>
          </div>
        </div>

        {symptom.notes && (
          <div className='mt-6 pt-6 border-t border-[#E3BAB3]'>
            <h2 className='text-sm font-medium text-[#800020] mb-2'>Notes</h2>
            <p className='text-[#4A4A4A] whitespace-pre-wrap'>
              {symptom.notes}
            </p>
          </div>
        )}

        <div className='mt-6 pt-6 border-t border-[#E3BAB3] text-sm text-[#4A4A4A]'>
          <p>Created: {new Date(symptom.createdAt).toLocaleString()}</p>
          <p>Last Updated: {new Date(symptom.updatedAt).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
