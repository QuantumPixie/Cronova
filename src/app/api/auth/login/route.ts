import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { loginSchema } from '@/lib/utils/validation/auth';
import type { LoginResponse } from '@/lib/types';

export async function POST(
  request: Request
): Promise<NextResponse<LoginResponse>> {
  try {
    const body = await request.json();
    const validatedData = loginSchema.safeParse(body);

    if (!validatedData.success) {
      const fieldErrors = validatedData.error.flatten().fieldErrors;
      const firstError = Object.values(fieldErrors)[0]?.[0] || 'Invalid input';
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { email, password } = validatedData.data;

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        name: true,
        menopauseStage: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 404 }
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const userWithoutPassword = {
      id: user.id,
      email: user.email,
      name: user.name,
      menopauseStage: user.menopauseStage,
      createdAt: user.createdAt,
    };

    return NextResponse.json(
      {
        message: 'Login successful',
        data: { user: userWithoutPassword },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      {
        error: 'An error occurred while logging in',
      },
      { status: 500 }
    );
  }
}
