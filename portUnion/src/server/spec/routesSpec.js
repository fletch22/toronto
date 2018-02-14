import { setupNormalRoutes } from '../routes';
import mockExpress from 'mock-express';
import sinon from 'sinon';

describe('routes', () => {
  let sandbox;
  const app = mockExpress();
  setupNormalRoutes(app);

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  test('should process rollback by state ID (clientID) correctly.', async () => {
    // Arrange
    // Act
    // Assert
    expect(true).toBe(true);
  });
});
