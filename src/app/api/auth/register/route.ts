import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { registerSchema } from '@/lib/auth/validation';
import { AuthError } from '@/lib/errors/auth-error';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = registerSchema.parse(body);

    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      throw new AuthError('Email already in use', 400, 'email_taken');
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        name: validatedData.name,
        menopauseStage: validatedData.menopauseStage,
      },
      select: {
        id: true,
        email: true,
        name: true,
        menopauseStage: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.status }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Registration failed' },
      { status: 500 }
    );
  }
}
