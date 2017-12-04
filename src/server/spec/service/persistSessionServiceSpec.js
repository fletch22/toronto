import persistSessionService from '../../service/persistSessionService';
import persistToDiskService from '../../service/persistToDiskService';
import sinon from 'sinon';
import fs from 'fs';

describe('PersistSessionService', () => {
  let sandbox;
  const expectedDate = new Date();
  let clock;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    clock = sinon.useFakeTimers(expectedDate.getTime());
  });

  afterEach(() => {
    sandbox.restore();
    clock.restore();
  });

  it('should save session state correctly.', (done) => {
    // Arrange
    const persistByOverwritingMock = sandbox.stub(persistToDiskService, 'persistByOverwriting').returns(Promise.resolve({ foo: 'bar' }));
    const sessionKey = 'foo';

    // Act
    persistSessionService.ensureSessionPersisted(sessionKey).then((result) => {
      // Assert
      expect(persistByOverwritingMock.calledOnce).toBe(true);
      const filePath = persistByOverwritingMock.getCall(0).args[0];
      const session = JSON.parse(persistByOverwritingMock.getCall(0).args[1]);
      expect(session.lastSavedSessionKey === sessionKey);
      expect(result.sessionFileCreateDate === expectedDate);
      expect(filePath.endsWith('session.json'));
      done();
    });
  });

  it('should get current session key', () => {
    // Arrange
    const sessionExpected = {
      lastSavedSessionKey: '1234567890'
    };

    const readMock = sandbox.stub(fs, 'readFileSync').returns(JSON.stringify(sessionExpected));
    const existsMock = sandbox.stub(fs, 'exists').returns(true);

    // Act
    const optionalSessionKey = persistSessionService.getCurrentSessionKey();

    // Assert
    expect(readMock.calledOnce);
    expect(existsMock.calledOnce);
    expect(optionalSessionKey.isPresent()).toBe(true);
    expect(optionalSessionKey.get()).toBe(sessionExpected.lastSavedSessionKey);
  });
});
