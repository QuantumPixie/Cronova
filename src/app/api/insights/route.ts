import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { insightsGenerator } from '@/lib/hugging-face/huggingface-insights-service';
import { JournalFormData, SymptomFormData } from '@/types';

type RequestData = {
  symptoms?: SymptomFormData;
  journalEntry?: JournalFormData;
};

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' });
    }

    const contentType = request.headers.get('content-type');
    let requestData: RequestData = {};

    if (contentType?.includes('application/json')) {
      try {
        requestData = await request.json();
      } catch {
        requestData = {};
      }
    }

    const [latestSymptom, latestJournal] = await Promise.all([
      prisma.symptomEntry.findFirst({
        where: { userId: session.user.id },
        orderBy: { date: 'desc' },
      }),
      prisma.journalEntry.findFirst({
        where: { userId: session.user.id },
        orderBy: { date: 'desc' },
      }),
    ]);

    const symptomData = requestData.symptoms || latestSymptom;
    const journalData = requestData.journalEntry || latestJournal;

    if (!symptomData || !journalData) {
      return NextResponse.json({
        success: false,
        error: 'No recent entries found to generate insights',
      });
    }

    const insights = await insightsGenerator.generateInsights(
      {
        hotFlashes: symptomData.hotFlashes,
        nightSweats: symptomData.nightSweats,
        moodSwings: symptomData.moodSwings,
        sleepIssues: symptomData.sleepIssues,
        anxiety: symptomData.anxiety,
        fatigue: symptomData.fatigue,
        intensity: symptomData.intensity,
        date: symptomData.date,
      },
      {
        mood: journalData.mood,
        sleep: journalData.sleep,
        exercise: journalData.exercise ?? false,
        stress: journalData.stress ?? 0,
        date: journalData.date,
      }
    );

    const savedInsight = await prisma.insight.create({
      data: {
        userId: session.user.id,
        date: new Date().toISOString(),
        content: insights.content,
        recommendations: insights.recommendations,
        source: insights.source,
        associatedSymptoms: insights.associatedSymptoms,
      },
    });

    return NextResponse.json({ success: true, data: savedInsight });
  } catch (error) {
    console.error('Error generating insights:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to generate insights',
    });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' });
    }

    const insights = await prisma.insight.findMany({
      where: { userId: session.user.id },
      orderBy: { date: 'desc' },
    });

    return NextResponse.json({ success: true, data: insights });
  } catch (error) {
    console.error('Error fetching insights:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch insights' },
      { status: 500 }
    );
  }
}
