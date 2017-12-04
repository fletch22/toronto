import { apiPath, setupNormalRoutes } from '../routes';
import mockExpress from 'mock-express';
import sinon from 'sinon';
import stateService from '../service/stateService';

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

    const pstdMock = sandbox.stub(stateService, 'persistStateArrays').returns(promise);

    const req = app.makeRequest({ host: 'foo' });

    // Act
    app.invoke('post', `${apiPath}/stateArrays/`, req, res);

    // Assert
    expect(pstdMock.calledOnce);

    return promise.then(() => {
      expect(actualResult).toBe('{"result":"success"}');
    });
  });

  it('should process sent statePackage correctly.', () => {
    // Arrange
    const res = app.makeResponse((err, data) => {

    });

    let actualResult = 'foo';

    res.send = (result) => {
      actualResult = result;
      c.lo(actualResult);
    };

    const promise = Promise.resolve();

    const pspMock = sandbox.stub(stateService, 'persistStatePackage').returns(promise);

    const req = app.makeRequest({ host: 'foo' });

    // Act
    app.invoke('post', `${apiPath}/statePackages`, req, res);

    // Assert
    expect(pspMock.calledOnce);
    return promise.then(() => {
      expect(actualResult).toBe('{"result":"success"}');
    });
  });

  it('should process get state by index correctly.', () => {
    // Arrange
    const res = app.makeResponse((err, data) => {

    });

    let actualResult = 'foo';

    res.send = (result) => {
      actualResult = result;
      c.lo(actualResult);
    };

    const expectedResult = { foo: 'bar' };

    const promise = Promise.resolve(expectedResult);

    const getStateByIndexStub = sandbox.stub(stateService, 'getStateByIndex').returns(promise);

    const req = app.makeRequest({ host: 'foo' });

    // Act
    app.invoke('get', `${apiPath}/stateIndexes/1`, req, res);

    // Assert
    expect(getStateByIndexStub.calledOnce);
    return promise.then(() => {
      expect(actualResult).toBe(JSON.stringify(expectedResult));
    });
  });
});
