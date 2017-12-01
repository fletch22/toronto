import persistStateToDiskService from '../../service/persistStateToDiskService';
import persistToDiskService from '../../service/persistToDiskService';
import persistSessionService from '../../service/persistSessionService';
import sinon from 'sinon';
import moment from 'moment';
import fs from 'fs';
import path from 'path';
import util from '../../util/util';

describe.only('PersistStateDiskService', () => {
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

    const writeToFileStub = sandbox.stub(persistToDiskService, 'writeToFile');

    // Act
    persistStateToDiskService.groupAndWrite(persistGrouping);

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
    const groupings = persistStateToDiskService.groupByTimestamp(states);

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
      filesMockNew.push(path.basename(persistStateToDiskService.composeFilePathFromSessionKey(now1 + (count * 1000))));
    });
    filesMockNew.sort();

    const readdirSyncStub = sandbox.stub(fs, 'readdirSync').returns(filesMockNew);

    // Act
    const mostRecent = persistStateToDiskService.findMostRecentHistoricalFile();

    // Assert
    expect(readdirSyncStub.callCount).toBe(1);
    expect(mostRecent.foundFile).toEqual(true);
    expect(mostRecent.filename).toEqual(filesMockNew[filesMockNew.length - 1]);
  });

  test('Should get the most recent historical state from the session stored', () => {
    // Arrange
    const now1 = new Date(moment()).getTime();

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

    const getCurrentSessionKeyMock = sandbox.stub(persistSessionService, 'getCurrentSessionKey').returns(now1.toString());
    const createLineReadStreamMock = sandbox.stub(persistStateToDiskService, 'createLineReadStream').returns(myEventEmitter);

    myEventEmitter.emit('line', null);
    expect.assertions(3);

    // Act
    return persistStateToDiskService.findMostRecentStateInFile().then((state) => {
      // Assert
      expect(getCurrentSessionKeyMock.callCount).toBe(1);
      expect(createLineReadStreamMock.callCount).toBe(1);
      expect(state).toEqual(expectedState2);
    });
  });
});

