import stateService from '../../service/stateService';
import fileService from '../../service/fileService';
import sessionService from '../../service/sessionService';
import sinon from 'sinon';
import moment from 'moment';
import fs from 'fs';
import path from 'path';
import util from '../../util/util';
import Optional from 'optional-js';

describe('StateService', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  const countLines = (str) => str.replace(/[^\n]/g, '').length;

  it('Should work correctly.', () => {
    // Arrange]
    const timestamp = new Date().getTime();
    console.log(timestamp);
    const states = [
      { foo: 'bar' },
      { foo: 'banana' },
      { foo: 'thing' }
    ];

    const persistGrouping = {
      1234567890: states,
      1234567891: states
    };

    const writeToFileStub = sandbox.stub(fileService, 'writeToFile');

    // Act
    stateService.groupAndWrite(persistGrouping);

    // Assert
    expect(writeToFileStub.callCount).toBe(2);

    const combinedLines = writeToFileStub.getCall(0).args[1];

    expect(countLines(combinedLines)).toBe(3);
  });

  it('Should create the filename part correctly', () => {
    // Arrange
    const timestamp1 = '1511114579664';
    const timestamp2 = (parseInt(timestamp1, 10) + 1).toString();
    const states = [
      { serverStartupTimestamp: timestamp1 },
      { serverStartupTimestamp: timestamp1 },
      { serverStartupTimestamp: timestamp2 }
    ];

    // Act
    const groupings = stateService.groupByTimestamp(states);

    const keys = [];
    for (const key in groupings) {
      if (groupings.hasOwnProperty(key)) {
        keys.push(key);
      }
    }

    // Assert
    expect(keys.length).toBe(2);
    expect(keys[0]).toBe(timestamp1);
    expect(keys[0]).toBe(timestamp1);
  });

  test('Should get the most recent historical file', () => {
    // Arrange
    const now1 = new Date(moment()).getTime();

    const filesMockNew = [];
    util.times(100)((count) => {
      filesMockNew.push(path.basename(stateService.composeFilePathFromSessionKey(now1 + (count * 1000))));
    });
    filesMockNew.sort();

    const readdirSyncStub = sandbox.stub(fs, 'readdirSync').returns(filesMockNew);

    // Act
    const mostRecent = stateService.findMostRecentHistoricalFile();

    // Assert
    expect(readdirSyncStub.callCount).toBe(1);
    expect(mostRecent.foundFile).toEqual(true);
    expect(mostRecent.filename).toEqual(filesMockNew[filesMockNew.length - 1]);
  });

  test('Should get the most recent historical state from the session stored', () => {
    // Arrange
    const expectedState1 = {
      foo: 'bar'
    };

    const expectedState2 = {
      foo: 'banana'
    };

    const EventEmitter = require('events');
    class MyEventEmitter extends EventEmitter {}

    const myEventEmitter = new MyEventEmitter();

    const arrayStates = [expectedState1, expectedState2];

    myEventEmitter.on = (value, fn) => {
      fn(JSON.stringify(arrayStates.pop()));
      myEventEmitter.emit('line', null);
    };

    const getCurrentSessionKeyMock = sandbox.stub(stateService, 'getFilePathOfCurrentSessionLog').returns(Optional.ofNullable('123456.txt'));
    const createLineReadStreamMock = sandbox.stub(stateService, 'createLineReadStream').returns(myEventEmitter);
    const fsExistsMock = sandbox.stub(fs, 'exists').returns(true);

    myEventEmitter.emit('line', null);
    expect.assertions(4);

    // Act
    return stateService.findMostRecentStateInFile().then((optionalState) => {
      // Assert
      expect(getCurrentSessionKeyMock.callCount).toBe(1);
      expect(createLineReadStreamMock.callCount).toBe(1);
      expect(fsExistsMock.callCount).toBe(1);
      expect(optionalState.value).toEqual(expectedState2);
    });
  });

  test('Should get the correct state', () => {
    // Arrange
    const expectedState1 = {
      foo: 'bar'
    };

    const expectedState2 = {
      foo: 'banana'
    };

    const EventEmitter = require('events');
    class MyEventEmitter extends EventEmitter {}

    const myEventEmitter = new MyEventEmitter();

    const arrayStates = [expectedState1, expectedState2];

    myEventEmitter.on = (value, fn) => {
      fn(JSON.stringify(arrayStates.pop()));
      myEventEmitter.emit('line', null);
    };

    const getCurrentSessionKeyMock = sandbox.stub(stateService, 'getFilePathOfCurrentSessionLog').returns(Optional.ofNullable('123456.txt'));
    const createLineReadStreamMock = sandbox.stub(stateService, 'createLineReadStream').returns(myEventEmitter);
    const fsExistsMock = sandbox.stub(fs, 'exists').returns(true);

    myEventEmitter.emit('line', null);
    expect.assertions(4);

    // Act
    expect(getCurrentSessionKeyMock.calledOnce);
    return stateService.findMostRecentStateInFile().then((optionalState) => {
      // Assert
      expect(getCurrentSessionKeyMock.callCount).toBe(1);
      expect(createLineReadStreamMock.callCount).toBe(1);
      expect(fsExistsMock.callCount).toBe(1);
      expect(JSON.stringify(optionalState.value)).toEqual(JSON.stringify(expectedState2));
    });
  });

  it('should get the correct number of lines in the file.', () => {
    // Arrange
     // Act
    stateService.getTotalStatesInSessionFile().then((optional) => {
      // Assert
      expect(optional.isPresent()).toBe(true);
      expect(optional.get() > 0).toBe(true);
    });
  });

  it('should get the correct state from index.', () => {
    // Arrange
    // Act
    stateService.getStateByIndex(-1).then((optional) => {
      // Assert
      c.l(`Value: ${optional.get()}`);
      expect(optional.isPresent()).toBe(true);
    });
  });

  it('should return empty optional when session key absent.', () => {
    // Arrange
    sandbox.stub(sessionService, 'getCurrentSessionKey').returns(Optional.empty());

    // Act
    const optionalFilePath = stateService.getFilePathOfCurrentSessionLog();

    // Assert
    expect(optionalFilePath.isPresent()).toBe(false);
  });

  it('should return optional file path when session key present.', () => {
    // Arrange
    sandbox.stub(sessionService, 'getCurrentSessionKey').returns(Optional.ofNullable('12345'));

    // Act
    const optionalFilePath = stateService.getFilePathOfCurrentSessionLog();

    // Assert
    expect(optionalFilePath.isPresent()).toBe(true);
    expect(optionalFilePath.get()).toBe('D:\\workspaces\\toronto\\temp\\stateLog-1969-12-31-18-00-12-PM.txt');
  });
});

