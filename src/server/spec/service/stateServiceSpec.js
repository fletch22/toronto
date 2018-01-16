import { default as stateService, stateLogPrefix } from '../../service/stateService';
import sessionService from '../../service/sessionService';
import sinon from 'sinon';
import moment from 'moment';
import fs from 'fs';
import path from 'path';
import util from '../../util/util';
import { default as utilHashCode } from '../../../app/js/util/util';
import Optional from 'optional-js';
import 'babel-core/register';
import EventEmitter from 'events';
import fileService from '../../service/fileService';
import winston from 'winston';

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
    const states = [
      { foo: 'bar' },
      { foo: 'banana' },
      { foo: 'thing' }
    ];

    const persistGrouping = {
      1234567890: states,
      1234567891: states
    };

    const writeStateToFileStub = sandbox.stub(stateService, 'writeStateToFile');

    // Act
    stateService.groupAndWrite(persistGrouping);

    // Assert
    expect(writeStateToFileStub.callCount).toBe(2);

    const combinedLines = writeStateToFileStub.getCall(0).args[1];

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

  test('Should get the most recent historical state from the session stored', async () => {
    // Arrange
    const expectedState1 = {
      foo: 'bar'
    };

    const expectedState2 = {
      foo: 'banana'
    };

    class MyEventEmitter extends EventEmitter {}

    const myEventEmitter = new MyEventEmitter();

    const arrayStates = [expectedState1, expectedState2];

    myEventEmitter.on = (value, fn) => {
      fn(JSON.stringify(arrayStates.pop()));
      myEventEmitter.emit('line', null);
    };

    const getCurrentSessionKeyMock = sandbox.stub(stateService, 'getFilePathOfCurrentSessionLog').returns(Optional.ofNullable('123456.txt'));
    const createLineReadStreamMock = sandbox.stub(stateService, 'createLineReadStream').returns(myEventEmitter);
    const tranformStub = sandbox.stub(stateService, 'transformMostRecentPersistedState').returns(expectedState2);
    const fsExistsMock = sandbox.stub(fileService, 'exists').returns(true);

    myEventEmitter.emit('line', null);

    // Act
    const optionalState = await stateService.findMostRecentStateInFile();
    // Assert
    expect(getCurrentSessionKeyMock.callCount).toBe(1);
    expect(createLineReadStreamMock.callCount).toBe(1);
    expect(tranformStub.callCount).toBe(1);
    expect(fsExistsMock.callCount).toBe(1);
    expect(optionalState.value).toEqual(expectedState2);
  });

  it('Should get the correct state', async () => {
    // Arrange
    const expectedState1 = {
      foo: 'bar'
    };
    // const persistedState1 = {
    //   state: JSON.stringify(expectedState1)
    // };
    // persistedState1[stateService.CLIENT_ID_MARKER] = 'abcde';

    const expectedState2 = {
      foo: 'banana'
    };

    class MyEventEmitter extends EventEmitter {}
    const myEventEmitter = new MyEventEmitter();

    const arrayStates = [expectedState1, expectedState2];

    myEventEmitter.on = (value, fn) => {
      fn(JSON.stringify(arrayStates.pop()));
      myEventEmitter.emit('line', null);
    };
    myEventEmitter.close = () => {};

    const getCurrentSessionKeyMock = sandbox.stub(stateService, 'getFilePathOfCurrentSessionLog').returns(Optional.ofNullable('123456.txt'));
    const fsExistsMock = sandbox.stub(fileService, 'exists').returns(true);
    const createLineReadStreamMock = sandbox.stub(stateService, 'createLineReadStream').returns(myEventEmitter);
    const transformMock = sandbox.stub(stateService, 'transformMostRecentPersistedState').returns(expectedState2);

    myEventEmitter.emit('line', null);

    // Act
    const optionalState = await stateService.findMostRecentStateInFile();

    // Assert
    expect(getCurrentSessionKeyMock.calledOnce);
    expect(getCurrentSessionKeyMock.callCount).toBe(1);
    expect(createLineReadStreamMock.callCount).toBe(1);
    expect(transformMock.callCount).toBe(1);
    expect(fsExistsMock.callCount).toBe(1);
    expect(JSON.stringify(optionalState.value)).toEqual(JSON.stringify(expectedState2));
  });

  it('should get the correct number of lines in the file.', (done) => {
    // Arrange
    const optionalSessionFilePath = Optional.ofNullable('foo.txt');

    class MyEventEmitter extends EventEmitter {}

    sandbox.stub(stateService, 'getFilePathOfCurrentSessionLog').returns(optionalSessionFilePath);
    sandbox.stub(fs, 'existsSync').returns(true);

    const myEventEmitter = new MyEventEmitter();

    myEventEmitter.on = (value, fn) => {
      fn(null);
      myEventEmitter.emit('line', null);
    };
    sandbox.stub(stateService, 'createLineReadStream').returns(myEventEmitter);

    // Act
    stateService.getTotalStatesInSessionFile().then((optional) => {
      expect(optional.isPresent()).toBe(true);
      expect(optional.get() > 0).toBe(true);
      done();
    });
  });

  it('should get the correct state from index.', async () => {
    // Arrange
    const getStatesInFileStub = sandbox.stub(stateService, 'getTotalStatesInSessionFile').returns(Optional.ofNullable(2));
    sandbox.stub(stateService, 'getFilePathOfCurrentSessionLog').returns(Optional.ofNullable('1234.txt'));

    const expectedState1 = {
      foo: 'bar'
    };

    const expectedState2 = {
      foo: 'banana'
    };

    class MyEventEmitter extends EventEmitter {}
    const myEventEmitter = new MyEventEmitter();

    const arrayStates = [expectedState1, expectedState2];

    myEventEmitter.on = (value, fn) => {
      if (value === 'line') {
        fn(JSON.stringify(arrayStates.pop()));
        if (arrayStates.length > 0) {
          myEventEmitter.emit('line', 'foo');
        }
      } else if (value === 'close') {
        fn();
      }
    };
    myEventEmitter.close = () => {};

    myEventEmitter.emit('line', 'foo');

    sandbox.stub(stateService, 'createLineReadStream').returns(myEventEmitter);
    sandbox.stub(fs, 'existsSync').returns(true);
    sandbox.stub(stateService, 'toggleIndexStartPoint').returns(0);

    const expectedResult = { foo: 'bar' };
    sandbox.stub(stateService, 'transformIndexSearchResult').returns(expectedResult);

    // Act
    const optional = await stateService.getStateByIndex(1);

    expect(getStatesInFileStub.calledOnce).toEqual(true);
    expect(optional.isPresent()).toBe(true);
    expect(JSON.stringify(expectedResult)).toEqual(JSON.stringify(optional.get()));
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

  it('should persist session files to disk (one file) successfully.', () => {
    // Arrange
    const expectedSessionKey = 'testSessionKey-foo';
    const getCurrentSessionKeyStub = sandbox.stub(sessionService, 'getCurrentSessionKey').returns(Optional.ofNullable(expectedSessionKey));
    const existsStub = sandbox.stub(fileService, 'exists').returns(true);
    const removeFolderStub = sandbox.stub(fileService, 'removeFolder');
    const makeFolderStub = sandbox.stub(fileService, 'makeFolder');
    const saveFilesToBackupFolderStub = sandbox.stub(stateService, 'saveFilesToBackupFolder');

    // Act
    const backupFolderPath = stateService.persistToDisk();

    // Assert
    expect(getCurrentSessionKeyStub.calledOnce).toBe(true);
    expect(existsStub.calledOnce).toBe(true);
    expect(removeFolderStub.calledOnce).toBe(true);
    expect(saveFilesToBackupFolderStub.calledOnce).toBe(true);
    expect(makeFolderStub.calledOnce).toBe(true);
    expect(backupFolderPath.endsWith(`\\temp\\backups\\${expectedSessionKey}`)).toBe(true);
  });

  it('should save files to backup folder successfully', () => {
    // Arrange
    const backupFolderPath = 'somePath/foo.txt';

    const expectedSessionPath = 'somePath/foo.txt';
    const expectedSessionLogPath = 'somePath/session.txt';
    const getSessionFilepathStub = sandbox.stub(sessionService, 'getSessionFilePath').returns(expectedSessionPath);
    const getFilePathOfCurrentSessionLogStub = sandbox.stub(stateService, 'getFilePathOfCurrentSessionLog').returns(Optional.ofNullable(expectedSessionLogPath));
    const saveBackupDataStub = sandbox.stub(stateService, 'saveBackupData');

    const copyStub = sandbox.stub(fileService, 'copy');

    // Act
    stateService.saveFilesToBackupFolder(backupFolderPath);

    // Assert
    expect(copyStub.callCount === 2).toBe(true);
    expect(getSessionFilepathStub.calledOnce).toBe(true);
    expect(getFilePathOfCurrentSessionLogStub.calledOnce).toBe(true);
    expect(saveBackupDataStub.calledOnce).toBe(true);
  });

  it('should restore files from backup folder successfully.', () => {
    // Arrange
    const rootPathExpected = 'mary/someRootPath';
    const getPersistRootPathStub = sandbox.stub(fileService, 'getPersistRootPath').returns(rootPathExpected);

    const backupFolderExpected = path.join(rootPathExpected, 'somePath/backupFolder');
    const getCurrentBackupFolderStub = sandbox.stub(stateService, 'getCurrentBackupFolder').returns(backupFolderExpected);
    const getLogFilenameInFolderStub = sandbox.stub(stateService, 'getLogFilenameInFolder').returns('foo.txt');
    const copyStub = sandbox.stub(fileService, 'copy');

    // Act
    stateService.restoreFromDisk();

    // Assert
    expect(getPersistRootPathStub.calledOnce);
    expect(getCurrentBackupFolderStub.calledOnce);
    expect(getLogFilenameInFolderStub.calledOnce);
    expect(copyStub.callCount === 2);
  });

  it('should get the log filename in the folder successfully.', () => {
    // Arrange
    const pathBackupFolder = 'somePath/foo';
    const stateLogFilenameExpected = `${stateLogPrefix}-banana.log`;
    const contentsExpected = ['foo.json', stateLogFilenameExpected];
    const getFolderContentNamesStub = sandbox.stub(fileService, 'getFolderContentNames').returns(contentsExpected);

    // Act
    const logFilenameActual = stateService.getLogFilenameInFolder(pathBackupFolder);

    // Assert
    expect(stateLogFilenameExpected).toEqual(logFilenameActual);
    expect(getFolderContentNamesStub.calledOnce).toBe(true);
  });

  it('should map stunt doubles successfully.', () => {
    // Arrange
    const stateString = fileService.readFile('D:\\workspaces\\toronto\\temp\\stuntDoubleState.json');
    const state = JSON.parse(JSON.parse(stateString));

    // Act
    const stuntDoubles = stateService.mapStuntDoubles(state.model);

    // Assert
    const keys = Object.keys(stuntDoubles);
    expect(keys.length).toEqual(16);
    const stuntMen = keys.filter((item) => {
      const idValue = stuntDoubles[item];
      return idValue.indexOf('-') > -1;
    });
    expect(stuntMen.length).toEqual(1);
  });

  it('should get stunt double info successfully.', () => {
    // Arrange
    const stuntDoubles = {
      1234: '2345',
      2553: '21345-fadsjksdafkjl-14322134',
      3245: '2343'
    };

    // Act
    const result = stateService.getStuntDoubleInfo(stuntDoubles);

    // Assert
    const idsToReplace = result.idsToReplace;
    expect(idsToReplace.length).toEqual(1);
    expect(idsToReplace[0]).toEqual(stuntDoubles[2553]);
    expect(result.highestId).toEqual(2345);
  });

  it('should replace stunt doubles successfully.', () => {
    // Arrange
    const stateString = fileService.readFile('D:\\workspaces\\toronto\\temp\\stuntDoubleState.json');
    const state = JSON.parse(JSON.parse(stateString));

    // Act
    const stateNew = stateService.replaceStuntDoubles(state);
    const hashCode = utilHashCode.hashCode(JSON.stringify(stateNew));

    // Assert
    expect(hashCode).toEqual(1728154470);
  });

  it('should destroy everything when nuke and pave is called.', async () => {
    // Arrange
    const rollbackToStub = sandbox.stub(stateService, 'rollbackTo').returns(Promise.resolve());

    stateService.stateIndex = ['123'];

    // Act
    const result = await stateService.nukeAndPave();

    // Assert
    expect(rollbackToStub.callCount).toBe(1);
  });

  it('should not call nukeAndPave if nothing is in the stateIndex.', async () => {
    // Arrange
    const rollbackToStub = sandbox.stub(stateService, 'rollbackTo').returns(Promise.resolve());

    stateService.stateIndex = [];

    // Act
    const result = await stateService.nukeAndPave();

    // Assert
    expect(rollbackToStub.callCount).toBe(0);
  });
});

