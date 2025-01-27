import type { Config } from 'jest';
import nextJest from 'next/jest';

const createJestConfig = nextJest({
  dir: './',
});

const config: Config = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: ['**/__tests__/**/*.test.ts?(x)', '**/*.test.ts?(x)'],
  collectCoverage: true,
  collectCoverageFrom: [
    './src/components/**/*.{ts,tsx}',
    '!./src/components/**/*.d.ts',
    '!**/node_modules/**',
  ],
  coverageThreshold: {
    global: {
      branches: 30,
      functions: 30,
      lines: 30,
      statements: 30,
    },
  },
  coveragePathIgnorePatterns: [
    'node_modules',
    'lib',
    '.next',
    'coverage',
    'jest.config.ts',
    'jest.setup.ts',
    '__tests__',
    'types',
  ],
  moduleDirectories: ['node_modules', '<rootDir>/'],
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  transformIgnorePatterns: [
    '/node_modules/',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};

export default createJestConfig(config);
