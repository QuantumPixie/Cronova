import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { registerSchema } from '@/lib/utils/validation/auth';
import type { RegisterResponse } from '@/lib/types';

export async function POST(
  request: Request
): Promise<NextResponse<RegisterResponse>> {
  try {
    const body = await request.json();
    const validatedData = registerSchema.safeParse(body);

    if (!validatedData.success) {
      const fieldErrors = validatedData.error.flatten().fieldErrors;
      const firstError = Object.values(fieldErrors)[0]?.[0] || 'Invalid input';

      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { email, password, name } = validatedData.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already registered' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        name: name ? name.trim() : null,
        menopauseStage: 'PERIMENOPAUSE',
      },
      select: {
        id: true,
        email: true,
        name: true,
        menopauseStage: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        message: 'Registration successful',
        user,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
