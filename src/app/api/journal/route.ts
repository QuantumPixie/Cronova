import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import type { JournalFormData } from '@/types/journal';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' });
    }

    const formData: JournalFormData = await request.json();

    console.log('Creating journal entry with data:', formData);

    const entry = await prisma.journalEntry.create({
      data: {
        userId: session.user.id,
        date: formData.date,
        mood: formData.mood,
        sleep: formData.sleep,
        exercise: formData.exercise,
        diet: formData.diet || [],
        stress: formData.stress,
        notes: formData.notes || '',
      },
    });

    console.log('Created journal entry:', entry);

    return NextResponse.json({ success: true, data: entry });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to save journal entry',
    });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' });
    }

    const entries = await prisma.journalEntry.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        date: 'desc',
      },
    });

    return NextResponse.json({ success: true, data: entries });
  } catch (error) {
    console.error('Error fetching journal entries:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch journal entries' },
      { status: 500 }
    );
  }
}
