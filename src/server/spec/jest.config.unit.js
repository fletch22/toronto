module.exports = {
  rootDir: '../../',
  bail: true,
  verbose: true,
  testEnvironment: 'node',
  testMatch: ['**/src/server/spec/unit/**/*.js'],
  setupFiles: ['./server/spec/beforeAllTests.js']
};
