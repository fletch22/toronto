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

  it('should route home page correctly', () => {
    // Arrange
    const res = app.makeResponse((err, data) => {
      expect(true).toBe(true);
    });

    let actualPath = '';
    res.sendFile = (path) => {
      actualPath = path;
    };

    app.makeRequest({ host: 'foo' });

    // Act
    app.invoke('get', '/');

    // Assert
    expect(actualPath).toBe('D:\\workspaces\\toronto\\index.html');
  });
});
