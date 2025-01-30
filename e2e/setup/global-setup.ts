import { config } from 'dotenv';
import { execSync } from 'child_process';
import { PrismaClient } from '@prisma/client';

config({ path: '.env.test' }); // Load the test environment variables

async function globalSetup() {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('This setup should only run in test environment');
  }

  if (!process.env.TEST_DATABASE_URL) {
    throw new Error(
      'TEST_DATABASE_URL is not defined. Make sure .env.test is loaded.'
    );
  }

  console.log('Running database migrations for test environment...');
  try {
    // Use TEST_DATABASE_URL for migrations
    execSync('npx prisma migrate deploy', {
      stdio: 'inherit',
      env: { ...process.env, DATABASE_URL: process.env.TEST_DATABASE_URL },
    });
  } catch (error) {
    console.error('Failed to run migrations:', error);
    throw error;
  }

  // Initialize Prisma client with test database URL
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.TEST_DATABASE_URL,
      },
    },
  });

  try {
    await prisma.$connect();
    await prisma.symptomEntry.deleteMany({});
    await prisma.journalEntry.deleteMany({});
    await prisma.insight.deleteMany({});
    await prisma.user.deleteMany({});
    console.log('Test database cleaned successfully');
  } catch (error) {
    console.error('Failed to clean test database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export default globalSetup;
