import 'next-auth';
import { MenopauseStage } from '@prisma/client';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string | null;
      menopauseStage: MenopauseStage | null;
      emailVerified: Date | null;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string | null;
    menopauseStage: MenopauseStage | null;
    emailVerified: Date | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    email: string;
    name: string | null;
    menopauseStage: MenopauseStage | null;
    emailVerified: Date | null;
  }
}
