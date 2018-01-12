module.exports = {
  rootDir: '../',
  bail: true,
  verbose: true,
  testEnvironment: 'node',
  testMatch: ['**/src/server/spec/**/*Spec.js'],
  setupFiles: ['./spec/beforeAllTests.js']
};
