import { apiPath, setupNormalRoutes } from '../routes';
import mockExpress from 'mock-express';
import sinon from 'sinon';
import persistStateToDiskService from '../service/persistStateToDiskService';

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

  it('should process sent state correctly.', () => {
    // Arrange
    const res = app.makeResponse((err, data) => {

    });

    let actualResult = 'foo';
    res.send = (result) => {
      actualResult = result;
    };

    const promise = Promise.resolve();

    const pstdMock = sandbox.stub(persistStateToDiskService, 'persistState').returns(promise);

    const req = app.makeRequest({ host: 'foo' });

    // Act
    app.invoke('post', `${apiPath}/`, req, res);

    // Assert
    expect(pstdMock.calledOnce);

    return promise.then((result) => {
      expect(actualResult).toBe('{ "result": "success" }');
    });
  });
});
