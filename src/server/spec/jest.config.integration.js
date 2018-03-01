module.exports = {
  rootDir: '../../',
  bail: true,
  verbose: true,
  testEnvironment: 'node',
  testMatch: ['**/src/server/spec/integration/**/serverApp*Spec.js'],
  setupFiles: ['./server/spec/beforeAllTests.js']
};
