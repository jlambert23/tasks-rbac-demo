module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  moduleNameMapping: {
    '^@tasks/(.*)$': '<rootDir>/../$1',
  },
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
};