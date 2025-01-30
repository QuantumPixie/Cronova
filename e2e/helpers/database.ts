import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.TEST_DATABASE_URL,
    },
  },
});

export async function createTestUser(data: {
  email: string;
  password: string;
  name?: string;
  menopauseStage?: 'PERIMENOPAUSE' | 'MENOPAUSE' | 'POSTMENOPAUSE';
}) {
  const password = data.password.startsWith('$2b$')
    ? data.password
    : await bcrypt.hash(data.password, 12);

  return prisma.user.create({
    data: {
      email: data.email,
      password,
      name: data.name,
      menopauseStage: data.menopauseStage || 'PERIMENOPAUSE',
    },
  });
}

export async function cleanupTestData() {
  await prisma.$transaction([
    prisma.symptomEntry.deleteMany(),
    prisma.journalEntry.deleteMany(),
    prisma.insight.deleteMany(),
    prisma.user.deleteMany(),
  ]);
}
