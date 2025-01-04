import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import type { SymptomFormData } from '@/types/symptoms';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' });
    }

    const formData: SymptomFormData = await request.json();

    console.log('Creating symptom with data:', formData);

    const symptom = await prisma.symptomEntry.create({
      data: {
        userId: session.user.id,
        date: formData.date,
        hotFlashes: formData.hotFlashes,
        nightSweats: formData.nightSweats,
        moodSwings: formData.moodSwings,
        sleepIssues: formData.sleepIssues,
        anxiety: formData.anxiety,
        fatigue: formData.fatigue,
        intensity: formData.intensity,
        notes: formData.notes || '',
      },
    });

    console.log('Created symptom:', symptom);

    return NextResponse.json({ success: true, data: symptom });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to save symptom',
    });
  }
}
