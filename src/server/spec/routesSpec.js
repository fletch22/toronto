import { apiPath, setupNormalRoutes } from '../routes';
import mockExpress from 'mock-express';
import sinon from 'sinon';
import stateService from '../service/stateService';
import Optional from 'optional-js';
import winston from 'winston';

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

  it('should process sent state correctly.', async () => {
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
    expect.assertions(2);

    await promise;

    expect(pstdMock.calledOnce).toEqual(true);
    expect(actualResult).toBe('{"result":"success"}');
  });

  it('should process sent statePackage correctly.', async () => {
    // Arrange
    const res = app.makeResponse((err, data) => {

    });

    let actualResult = 'foo';

    res.send = (result) => {
      actualResult = result;
    };

    const promise = Promise.resolve();

    const pspMock = sandbox.stub(stateService, 'persistStatePackage').returns(promise);

    const req = app.makeRequest({ host: 'foo' });

    // Act
    app.invoke('post', `${apiPath}/statePackages`, req, res);

    // Assert
    expect.assertions(2);

    await promise;

    expect(pspMock.calledOnce).toEqual(true);
    expect(actualResult).toBe('{"result":"success"}');
  });

  it('should process get state by index correctly.', async () => {
    // Arrange
    const res = app.makeResponse((err, data) => {

    });

    let actualResult = 'foo';

    res.send = (result) => {
      actualResult = result;
    };

    const expectedResult = Optional.ofNullable({ foo: 'bar' });

    const promise = Promise.resolve(expectedResult);

    const getStateByIndexStub = sandbox.stub(stateService, 'getStateByIndex').returns(promise);

    const req = app.makeRequest({ host: 'foo' });

    // Act
    app.invoke('get', `${apiPath}/stateIndexes/1`, req, res);

    // Assert
    expect.assertions(2);

    await promise;

    expect(getStateByIndexStub.calledOnce).toEqual(true);
    expect('{"isPresent":true,"value":{"foo":"bar"}}').toBe(actualResult);
  });

  test('should process rollback by state ID (clientID) correctly.', async () => {
    // Arrange
    const res = app.makeResponse((err, data) => {

    });

    let actualResult = 'foo';

    res.send = (result) => {
      actualResult = result;
    };

    const expectedResult = Optional.ofNullable({ foo: 'bar' });

    const promise = Promise.resolve(expectedResult);

    const getStateByIndexStub = sandbox.stub(stateService, 'rollbackTo').returns(promise);

    const req = app.makeRequest({ host: 'foo' });

    // Act
    app.invoke('post', `${apiPath}/states/ASDRKECKLDLS?action=rollbackTo`, req, res);

    // Assert
    expect.assertions(2);

    await promise;

    expect(getStateByIndexStub.calledOnce).toEqual(true);
    expect(actualResult).toBe('{"isPresent":true,"value":{"foo":"bar"}}');
  });
});
