import '@testing-library/jest-dom';

// Mock window.fetch
global.fetch = jest.fn();

// // Mock window.fs
// global.window.fs = {
//   readFile: jest.fn(),
//   writeFile: jest.fn(),
// };

// Existing Prisma mock
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

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: '',
      asPath: '',
      push: jest.fn(),
      replace: jest.fn(),
      refresh: jest.fn(),
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
  usePathname: jest.fn(() => '/'),
  useSearchParams: jest.fn(() => new URLSearchParams()),
  redirect: jest.fn(),
}));

// Mock next-auth
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({
    data: null,
    status: 'unauthenticated',
    update: jest.fn(),
  })),
  signIn: jest.fn(),
  signOut: jest.fn(),
  getServerSession: jest.fn(),
}));

// // Mock next/image
// jest.mock('next/image', () => ({
//   __esModule: true,
//   default: (props: any) => {
//     return <img {...props} alt={props.alt} />;
//   },
// }));

// Mock huggingface service
jest.mock('@/lib/hugging-face/huggingface-insights-service', () => ({
  insightsGenerator: {
    generateInsights: jest.fn(),
  },
}));

// Mock date-fns
jest.mock('date-fns', () => ({
  ...jest.requireActual('date-fns'),
  parseISO: jest.fn((date) => new Date(date)),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  format: jest.fn((date, _format) => date.toISOString()),
  differenceInMonths: jest.fn(() => 0),
}));

// Reset all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});
