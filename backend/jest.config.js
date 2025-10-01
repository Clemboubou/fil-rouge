module.exports = {
  // Test environment
  testEnvironment: 'node',

  // Coverage configuration
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js',
    '!src/config/**',
    '!src/seeds/**',
    '!src/utils/seedDatabase.js',
    '!src/**/*.test.js',
    '!src/**/__tests__/**'
  ],

  // Coverage thresholds
  coverageThresholds: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },

  // Test match patterns
  testMatch: [
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js'
  ],

  // Setup files
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  // Transform files
  transform: {},

  // Module paths
  moduleDirectories: ['node_modules', 'src'],

  // Ignore patterns
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/coverage/'
  ],

  // Verbose output
  verbose: true,

  // Clear mocks between tests
  clearMocks: true,

  // Reset mocks between tests
  resetMocks: true,

  // Restore mocks between tests
  restoreMocks: true,

  // Test timeout
  testTimeout: 10000,

  // Force exit after tests
  forceExit: true,

  // Detect open handles
  detectOpenHandles: true
};
