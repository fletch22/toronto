module.exports = {
  bail: true,
  verbose: true,
  testEnvironment: 'node',
  testMatch: ['**/src/server/spec/**/*Spec.js'],
  setupFiles: ['./beforeAllTests.js']
};
