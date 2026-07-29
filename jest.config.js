module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/api/__tests__'],
  testMatch: ['**/*.test.js'],
  testTimeout: 15000,
  setupFilesAfterSetup: [],
  verbose: true,
  forceExit: true,
  detectOpenHandles: true,
};