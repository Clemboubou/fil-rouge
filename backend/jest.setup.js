// Jest setup file
// This file runs before each test suite

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-for-testing-only';
process.env.BCRYPT_ROUNDS = '4'; // Faster for tests
process.env.DB_NAME = 'quizmaster_test';

// Increase test timeout for slower machines
jest.setTimeout(10000);

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  // Uncomment to suppress console output in tests
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  // warn: jest.fn(),
  error: console.error, // Keep errors visible
};

// Clean up after all tests
afterAll(async () => {
  // Close any open database connections
  // Add cleanup code here if needed
});
