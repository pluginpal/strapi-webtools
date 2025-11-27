module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/?(*.)+(spec|test).(ts|js)'],
  // transform: {},
  // globalSetup: './playground/__tests__/setup-strapi.ts',
  // setupFilesAfterEnv: ['./playground/__tests__/setup-strapi.ts'],
  // globalTeardown: './playground/__tests__/teardown-strapi.ts',
  coverageDirectory: './coverage/',
  collectCoverage: true,
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'ts-jest',
  },
  testTimeout: 30_000,
};
