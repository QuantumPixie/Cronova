import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

const updateSchema = z.object({
  name: z.string().optional().nullish(),
  menopauseStage: z
    .enum(['PERIMENOPAUSE', 'MENOPAUSE', 'POSTMENOPAUSE'])
    .optional()
    .nullish(),
  lastPeriodDate: z.string().optional().nullish(),
});

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = updateSchema.parse(body);

    const updateData: Record<string, unknown> = {};

    if (validatedData.name !== undefined) updateData.name = validatedData.name;
    if (validatedData.menopauseStage !== undefined)
      updateData.menopauseStage = validatedData.menopauseStage;
    if (validatedData.lastPeriodDate !== undefined)
      updateData.lastPeriodDate = validatedData.lastPeriodDate;

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        menopauseStage: true,
        lastPeriodDate: true,
      },
    });

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    console.error('Settings update error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid data provided',
          details: error.errors,
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
