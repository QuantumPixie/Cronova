import '@testing-library/jest-dom';

jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
    symptomEntry: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
    journalEntry: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
    },
    insight: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  },
}));

jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: '',
      asPath: '',
      push: jest.fn(),
      replace: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn(),
      beforeHistoryChange: jest.fn(),
      isReady: true,
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
    };
  },
  usePathname: jest.fn(),
  useSearchParams: jest.fn(),
  redirect: jest.fn(),
}));

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({
    data: null,
    status: 'unauthenticated',
  })),
  signIn: jest.fn(),
  signOut: jest.fn(),
  getServerSession: jest.fn(),
}));

jest.mock('@/lib/hugging-face/huggingface-insights-service', () => ({
  insightsGenerator: {
    generateInsights: jest.fn(),
  },
}));

jest.mock('date-fns', () => ({
  ...jest.requireActual('date-fns'),
  parseISO: jest.fn(),
  format: jest.fn(),
  differenceInMonths: jest.fn(),
}));
