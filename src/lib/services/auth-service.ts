import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import type { AuthenticatedUser } from '@/types/auth';

export async function authenticateUser(
  email: string,
  password: string
): Promise<AuthenticatedUser> {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      password: true,
      name: true,
      menopauseStage: true,
    },
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Invalid email or password');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}
