module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/?(*.)+(spec|test).(ts|js)'],
  modulePathIgnorePatterns: ['<rootDir>/playground/.yalc'],
  setupFiles: ['<rootDir>/jest.setup.js'],
  // transform: {},
  // globalSetup: './playground/__tests__/setup-strapi.ts',
  // setupFilesAfterEnv: ['./playground/__tests__/setup-strapi.ts'],
  // globalTeardown: './playground/__tests__/teardown-strapi.ts',
  coverageDirectory: './coverage/',
  collectCoverage: true,
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.jest.json',
      },
    ],
    '^.+\\.(js|jsx)$': [
      'babel-jest',
      {
        presets: [['@babel/preset-env', { targets: { node: 'current' } }]],
      },
    ],
  },
  testTimeout: 30_000,
};
