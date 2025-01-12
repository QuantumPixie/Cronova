import { MenopauseStage } from '@prisma/client';
import 'next-auth';
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string | null;
      menopauseStage: MenopauseStage | null;
      emailVerified: Date | null;
      lastPeriodDate: string | null;
      periodDates: string[];
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    email: string;
    name: string | null;
    menopauseStage: MenopauseStage | null;
    emailVerified: Date | null;
    lastPeriodDate: string | null;
    periodDates: string[];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    email: string;
    name: string | null;
    menopauseStage: MenopauseStage | null;
    emailVerified: Date | null;
    lastPeriodDate: string | null;
    periodDates: string[];
  }
}
