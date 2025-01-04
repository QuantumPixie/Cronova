import 'next-auth';
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      menopauseStage?: 'PERIMENOPAUSE' | 'MENOPAUSE' | 'POSTMENOPAUSE' | null;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    email: string;
    name?: string | null;
    menopauseStage?: 'PERIMENOPAUSE' | 'MENOPAUSE' | 'POSTMENOPAUSE' | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    email: string;
    name?: string | null;
    menopauseStage?: 'PERIMENOPAUSE' | 'MENOPAUSE' | 'POSTMENOPAUSE' | null;
  }
}
