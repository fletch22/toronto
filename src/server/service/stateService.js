import moment from 'moment';
import format from 'string-template';
import path from 'path';
import fileService from './fileService';
import { stopwatch } from 'durations';
import objectUtil from '../util/objectUtil';
import fs from 'fs';
import readline from 'readline';
import Optional from 'optional-js';
import 'babel-core/register';
import util from '../../util/util';
import winston from 'winston';
import _ from 'lodash';
import randomstring from 'randomstring';
import 'babel-polyfill';
import { sessionFilename, default as sessionService } from './sessionService';
import serializerService from './serializerService';
import initialState from '../config/initialState';

const watch = stopwatch();
const persistDateFormat = 'YYYY-MM-DD-HH-mm-ss-A';
export const persistRootPath = fileService.getPersistRootPath();
export const stateLogPrefix = 'stateLog-';
export const stateLogSuffix = '.txt';
const filePathTemplate = path.join(persistRootPath, `${stateLogPrefix}{persistFilenamePart}${stateLogSuffix}`);
const backupRootPath = path.join(persistRootPath, 'backups');
const backupDataPath = path.join(backupRootPath, 'backupData.json');
const backupFilePathTemplate = path.join(backupRootPath, '{backupFolderName}');

const CLIENT_ID_MARKER = 'CLIENT_ID_dk89h22njkfdu90jo21kl231kl2199';

class StateService {

  constructor() {
    this.getPersistFilenamePart = this.getPersistFilenamePart.bind(this);
    this.groupAndWrite = this.groupAndWrite.bind(this);
    this.composeFilePathFromSessionKey = this.composeFilePathFromSessionKey.bind(this);
    this.saveDataToFile = this.saveDataToFile.bind(this);
    this.groupByTimestamp = this.groupByTimestamp.bind(this);
    this.persistStateArrays = this.persistStateArrays.bind(this);
    this.sortSessionKeys = this.sortSessionKeys.bind(this);
    this.createLineReadStream = this.createLineReadStream.bind(this);
    this.writeStateToFile = this.writeStateToFile.bind(this);
    this.persistStatePackage = this.persistStatePackage.bind(this);
    this.persistToDisk = this.persistToDisk.bind(this);

    this.stateIndex = [];
  }

  getPersistFilenamePart(serverStartupTimestamp) {
    const startupTimestamp = new Date(parseInt(serverStartupTimestamp, 10));
    return `${moment(startupTimestamp.toISOString()).format(persistDateFormat)}`;
  }

  groupAndWrite(persistGrouping) {
    const allWrites = [];
    for (const key in persistGrouping) {
      winston.info(`Persist key from persistGrouping: ${key}`);
      if (persistGrouping.hasOwnProperty(key)) {
        let combinedData = '';

        const arrayStates = persistGrouping[key];
        arrayStates.forEach((info) => {
          const stateInfo = this.transformToPersistState(info);
          const json = JSON.stringify(stateInfo); // NOTE: 2017-11-17: There should be no carriage returns here at this point.
          combinedData += `${json}\n`;
        });
        allWrites.push(this.writeStateToFile(key, combinedData));
      }
    }
    return Promise.all(allWrites);
  }

  transformToPersistState(statePackage) {
    const stateInfo = {};
    stateInfo[CLIENT_ID_MARKER] = statePackage.clientId;
    stateInfo.state = statePackage.state;

    if (!!statePackage.originalState) {
      const state = JSON.parse(statePackage.originalState);
      stateInfo.stuntDoubleReplacedState = this.replaceStuntDoubles(state);
    }

    return stateInfo;
  }

  transformIndexSearchResult(searchResult, totalLines) {
    const persistedState = JSON.parse(searchResult.line);

    return {
      state: JSON.parse(persistedState.state),
      clientId: persistedState[CLIENT_ID_MARKER],
      indexOfReturnedState: this.toggleIndexStartPoint(totalLines, searchResult.stopOnIndex)
    };
  }

  writeStateToFile(key, stateString) {
    winston.info('In writeStateToFile.');
    sessionService.persistSessionIfMissing(key);
    this.saveToStateIndex(stateString);
    return fileService.persistByAppending(this.composeFilePathFromSessionKey(key), `${_.trim(stateString)}\n`);
  }

  composeFilePathFromSessionKey(key) {
    winston.debug(`Session key to be used for timestamp filename. ${key}`);
    return format(filePathTemplate, { persistFilenamePart: this.getPersistFilenamePart(key) });
  }

  saveDataToFile(statesArray) {
    winston.info('About to groupByTimestamp.');
    // c.lo(statesArray, 'statesArray: ');
    const persistGrouping = this.groupByTimestamp(statesArray);

    winston.info('About to groupAndWrite...');
    return this.groupAndWrite(persistGrouping).then(() => {
      let sessionKeys = objectUtil.getPropertyKeys(persistGrouping);
      sessionKeys = this.sortSessionKeys(sessionKeys);

      return Promise.resolve(sessionKeys[sessionKeys.length - 1]);
    });
  }

  sortSessionKeys(sessionKeys) {
    sessionKeys.sort((key1, key2) => {
      const keyNumber1 = parseInt(key1, 10);
      const keyNumber2 = parseInt(key2, 10);

      return keyNumber1 - keyNumber2;
    });
    return sessionKeys;
  }

  groupByTimestamp(statesArray) {
    const persistGrouping = {};
    statesArray.forEach((state) => {
      if (!state.serverStartupTimestamp) {
        throw new Error('Encountered error when checking for serverStartupTimestamp. Found no key.');
      }
      const serverStartTimestamp = state.serverStartupTimestamp;
      if (!persistGrouping[serverStartTimestamp]) {
        persistGrouping[serverStartTimestamp] = [];
      }
      persistGrouping[serverStartTimestamp].push(state);
    });
    return persistGrouping;
  }

  persistStateArrays(stateArray) {
    winston.debug('Persist state arrays.');
    watch.reset();
    watch.start();

    return this.saveDataToFile(stateArray.states).then((data) => {
      watch.stop();
      const duration = watch.duration();
      winston.info(`Write duration: ${duration}`);
      return Promise.resolve(data);
    });
  }

  persistStatePackage(statePackage) {
    const persistState = this.transformToPersistState(statePackage);
    return this.writeStateToFile(statePackage.serverStartupTimestamp, JSON.stringify(persistState));
  }

  findMostRecentHistoricalFile() {
    winston.info('Find most recent historical file.');
    const matchingFiles = {};
    const keys = [];

    fs.readdirSync(persistRootPath).forEach(file => {
      if (file.startsWith(stateLogPrefix)) {
        const filenameSuffix = file.substring(stateLogPrefix.length);
        const indexOfExtension = filenameSuffix.indexOf(stateLogSuffix);
        const datestamp = filenameSuffix.substring(0, indexOfExtension);
        const key = new Date(moment(datestamp, persistDateFormat)).getTime();
        matchingFiles[key] = file;
        keys.push(key);
      }
    });

    keys.sort();

    return {
      foundFile: (keys.length > 0),
      filename: matchingFiles[keys[keys.length - 1]]
    };
  }

  getInitialState() {
    return util.getOptionalLiteral({ state: initialState, clientId: '12345', indexOfReturnedState: 0 });
  }

  findMostRecentStateInFile() {
    winston.info('Find most recent state in file.');

    return new Promise((resolve) => {
      let optionalResult = this.getInitialState();

      const optionalFilePath = this.getFilePathOfCurrentSessionLog();
      if (optionalFilePath.isPresent()) {
        const filepath = optionalFilePath.get();
        winston.info(`filepath found: ${filepath}`);
        if (fileService.exists(filepath)) {
          const lineReader = this.createLineReadStream(filepath);
          let lastLine;

          lineReader.on('line', (line) => {
            lastLine = line;
          });

          lineReader.on('close', () => {
            let persistedState = null;
            try {
              persistedState = JSON.parse(lastLine);
              optionalResult = util.getOptionalLiteral(this.transformMostRecentPersistedState(persistedState));
            } catch (err) {
              winston.error(err.message);
            }
            resolve(optionalResult);
          });
        } else {
          resolve(optionalResult);
        }
      } else {
        resolve(optionalResult);
      }
    });
  }

  transformMostRecentPersistedState(persistedState) {
    return { state: JSON.parse(persistedState.state), clientId: persistedState[CLIENT_ID_MARKER], indexOfReturnedState: 0 };
  }

  async findEarliestStateInFile() {
    winston.debug('Find most recent state in file.');

    return new Promise((resolve, reject) => {
      const optionalFilePath = this.getFilePathOfCurrentSessionLog();
      if (optionalFilePath.isPresent()) {
        const filepath = optionalFilePath.get();
        if (fs.existsSync(filepath)) {
          winston.debug(`filepath found: ${filepath}`);
          fileService.readFirstLine(filepath).then((line) => {
            resolve(line);
          });
        } else {
          reject(new Error('Encountered error. Could not find session log.'));
        }
      } else {
        reject(new Error('Encountered error. Could not determine session log path.'));
      }
    });
  }

  getFilePathOfCurrentSessionLog() {
    const optionalSessionKey = sessionService.getCurrentSessionKey();

    let optionalFilePath = Optional.empty();
    if (optionalSessionKey.isPresent()) {
      optionalFilePath = Optional.ofNullable(this.composeFilePathFromSessionKey(optionalSessionKey.get()));
      winston.debug(`Session log: ${optionalFilePath.get()}`);
    }
    return optionalFilePath;
  }

  createLineReadStream(filepath) {
    return readline.createInterface({
      input: fs.createReadStream(filepath)
    });
  }

  getTotalStatesInSessionFile() {
    return new Promise((resolve) => {
      const optionalFilePath = this.getFilePathOfCurrentSessionLog();
      if (optionalFilePath.isPresent()) {
        const filePath = optionalFilePath.get();
        if (fs.existsSync(filePath)) {
          const lineReader = this.createLineReadStream(filePath);

          let count = 0;
          lineReader.on('line', () => {
            count++;
          });

          lineReader.on('close', () => {
            resolve(Optional.ofNullable(count));
          });
        } else {
          resolve(Optional.ofNullable(0));
        }
      } else {
        resolve(Optional.ofNullable(0));
      }
    });
  }

  async getStateByIndex(index) {
    winston.info('getStateByIndex called.');
    winston.info(`typeof index: ${typeof index}`);

    const optionalTotalLines = await this.getTotalStatesInSessionFile();

    if (!optionalTotalLines.isPresent()) {
      throw new Error('There are no session states in the system.');
    }

    const totalLines = optionalTotalLines.get();
    winston.info(`Total lines: ${totalLines}: typeof: ${typeof totalLines}; index: ${index}`);
    const stopOnIndex = this.toggleIndexStartPoint(totalLines, index);

    const optionalFilePath = this.getFilePathOfCurrentSessionLog();
    return new Promise((resolve) => {
      if (optionalFilePath.isPresent()) {
        const filePath = optionalFilePath.get();
        winston.debug(`Fp: ${filePath}`);
        if (fs.existsSync(filePath)) {
          const lineReader = this.createLineReadStream(optionalFilePath.get());
          let indexSearchResult;

          let count = 0;
          winston.debug(`${typeof stopOnIndex}`);

          winston.debug(`soi: ${stopOnIndex}`);
          lineReader.on('line', (line) => {
            winston.debug(`Count: ${count}`);
            if (stopOnIndex === count) {
              indexSearchResult = {
                line,
                stopOnIndex
              };
              winston.debug('Closing lr.');
              lineReader.close();
            }
            count++;
          });

          lineReader.on('close', () => {
            if (!!indexSearchResult) {
              winston.info(`Close called. ${indexSearchResult.line.length}`);
              resolve(Optional.ofNullable(this.transformIndexSearchResult(indexSearchResult, totalLines)));
            } else {
              c.l('No index search results.');
              resolve(Optional.empty());
            }
          });
        } else {
          winston.info(`file not found: ${filePath}`);
          resolve(Optional.empty());
        }
      } else {
        winston.info('No log file path found:');
        resolve(Optional.empty());
      }
    });
  }

  toggleIndexStartPoint(totalLines, endIndex) {
    let index = endIndex;
    if (totalLines - 1 < index) {
      index = totalLines - 1;
    }
    index = (totalLines - 1) + (index * -1) - 1;
    index = index < 0 ? 0 : index;

    return index;
  }

  async reindexLogFile() {
    return new Promise((resolve) => {
      let optionalResult = util.getOptionalLiteral(null);

      const optionalFilePath = this.getFilePathOfCurrentSessionLog();
      if (optionalFilePath.isPresent()) {
        const logPath = optionalFilePath.get();
        winston.debug(`Log path: ${logPath}`);
        this.stateIndex = [];
        if (fs.existsSync(logPath)) {
          this.getTotalStatesInSessionFile().then((optionalTotalLines) => {
            const lineReader = this.createLineReadStream(logPath);
            let lastLine;

            if (optionalTotalLines.get() > 0) {
              lineReader.on('line', (line) => {
                lastLine = line;
                this.saveToStateIndex(line);
              });
            } else {
              lineReader.close();
            }

            lineReader.on('close', () => {
              winston.debug(`Last line: ${lastLine}`);

              let parsedLine = null;
              try {
                parsedLine = JSON.parse(lastLine);
                optionalResult = util.getOptionalLiteral(parsedLine);
              } catch (err) {
                winston.error(err.message);
              }

              resolve(optionalResult);
            });
          });
        } else {
          resolve(optionalResult);
        }
      }
    });
  }

  saveToStateIndex(stateString) {
    const indexOfKey = stateString.indexOf(CLIENT_ID_MARKER);
    if (indexOfKey > -1) {
      const startIndex = indexOfKey + CLIENT_ID_MARKER.length + 1;
      const quoteFirstIndex = stateString.indexOf('"', startIndex);
      const nextQuoteIndex = stateString.indexOf('"', quoteFirstIndex + 1);
      const clientId = stateString.substring(quoteFirstIndex + 1, nextQuoteIndex);
      this.stateIndex.push(clientId);
    }
  }

  async rollbackTo(clientId) {
    let optionalState = Optional.empty();
    optionalState = await this.getStateByClientId(clientId);
    winston.debug(`Index to rollback to: ${optionalState.get().stateIndex}`);

    if (optionalState.isPresent()) {
      const result = optionalState.get();
      const index = result.stateIndex;
      await this.truncateLog(index);
      this.reindexLogFile();
      return Promise.resolve(Optional.ofNullable(result.state));
    }

    return optionalState;
  }

  truncateLog(index) {
    return new Promise((resolve, reject) => {
      const optionalLogPath = this.getFilePathOfCurrentSessionLog();
      if (!optionalLogPath.isPresent()) {
        reject('Could not find session log.');
      }

      const logPath = optionalLogPath.get();
      const tmpPath = `${logPath}.tmp`;
      const lineReader = this.createLineReadStream(logPath);

      this.stateIndex = [];

      let count = 0;

      winston.debug(`Rolling back to ${index}`);

      lineReader.on('line', (line) => {
        if (count > index) {
          lineReader.close();
        } else {
          fileService.persistByAppending(tmpPath, `${line}\n`);
        }
        count++;
      });

      lineReader.on('close', () => {
        // Rename tmp file to actual log file.
        const suffix = randomstring.generate({
          length: 4,
          charset: 'alphabetic',
          capitalization: 'lowercase'
        });

        const renamedOriginal = `${logPath}.old.${suffix}`;
        fileService.rename(logPath, renamedOriginal);
        fileService.rename(tmpPath, logPath);
        // TODO: 2017-01-15: Uncomment when ready.
        //fileService.delete(renamedOriginal);
        resolve('Success');
      });
    });
  }

  async getStateByClientId(clientId) {
    const stateIndex = this.stateIndex.indexOf(clientId);
    if (stateIndex === -1) {
      throw new Error(`Could not find clientID ${clientId} in State Index array; State index length: ${this.stateIndex.length}.`);
    }
    const optionalTotalLines = await this.getTotalStatesInSessionFile();
    winston.debug(`Called getStateByClientId. Indexes: ${stateIndex}`);
    const totalLines = optionalTotalLines.get();
    winston.debug(`Tot lines: ${totalLines}`);

    const index = this.toggleIndexStartPoint(totalLines, stateIndex);
    const optionalState = await this.getStateByIndex(index);

    let optionalResult = Optional.empty();
    if (optionalState.isPresent()) {
      const state = optionalState.get();
      const result = {
        state,
        stateIndex,
        totalLines
      };
      winston.debug(`state found: ${JSON.stringify(state).length}`);

      optionalResult = Optional.ofNullable(result);
    }

    return Promise.resolve(optionalResult);
  }

  persistToDisk() {
    const optionalSessionKey = sessionService.getCurrentSessionKey();

    if (!optionalSessionKey.isPresent()) {
      throw new Error('Encountered error when trying to persist state to disk. Could not get session key. If there is no session, nothing can be saved.');
    }
    const sessionKey = optionalSessionKey.get();

    const backupFolderPath = format(backupFilePathTemplate, { backupFolderName: sessionKey });
    if (fileService.exists(backupFolderPath)) {
      fileService.removeFolder(backupFolderPath);
    }
    fileService.makeFolder(backupFolderPath);

    this.saveFilesToBackupFolder(backupFolderPath, sessionKey);

    return backupFolderPath;
  }

  saveFilesToBackupFolder(backupFolderPath, sessionKey) {
    const sessionFilePath = sessionService.getSessionFilePath();
    const optionalSessionLogPath = this.getFilePathOfCurrentSessionLog();

    const sessionBackupPath = path.join(backupFolderPath, sessionFilename);
    fileService.copy(sessionFilePath, sessionBackupPath);

    this.saveOptionalLog(optionalSessionLogPath, backupFolderPath);

    this.saveBackupData(sessionKey);
  }

  saveOptionalLog(optionalSessionLogPath, backupFolderPath) {
    if (optionalSessionLogPath.isPresent()) {
      const currentLogPath = optionalSessionLogPath.get();
      const logFilename = path.basename(currentLogPath);
      const logBackupPath = path.join(backupFolderPath, logFilename);
      fileService.copy(currentLogPath, logBackupPath);
    }
  }

  saveBackupData(backupFolderName) {
    const body = {
      currentBackupFolder: backupFolderName
    };

    serializerService.toDisk(backupDataPath, body);
  }

  restoreFromDisk() {
    const backupFolder = this.getCurrentBackupFolder();

    const pathBackupFolder = path.join(backupRootPath, backupFolder);

    this.copyBackupLogToStateFolder(pathBackupFolder);
    this.copyBackupSessionToStateFolder(pathBackupFolder);
  }

  copyBackupSessionToStateFolder(pathBackupFolder) {
    const pathSession = path.join(pathBackupFolder, sessionFilename);
    const destinationSessionPath = path.join(fileService.getPersistRootPath(), sessionFilename);
    fileService.copy(pathSession, destinationSessionPath);
  }

  copyBackupLogToStateFolder(pathBackupFolder) {
    const stateLogFilename = this.getLogFilenameInFolder(pathBackupFolder);
    const pathBackupLog = path.join(pathBackupFolder, stateLogFilename);
    const destinationLogPath = path.join(fileService.getPersistRootPath(), stateLogFilename);
    fileService.copy(pathBackupLog, destinationLogPath);
  }

  getCurrentBackupFolder() {
    const backup = serializerService.fromDisk(backupDataPath);
    return backup.currentBackupFolder;
  }

  getLogFilenameInFolder(pathBackupFolder) {
    const dirItems = fileService.getFolderContentNames(pathBackupFolder);

    const stateLogNames = dirItems.filter((item) => item.startsWith(stateLogPrefix));
    if (stateLogNames.length > 1) {
      throw new Error(`Encountered error while trying to get log name. Got more than one log name starting with ${stateLogPrefix}`);
    }

    return stateLogNames[0];
  }

  replaceStuntDoubles(state) {
    const model = state.model;

    const stuntDoubles = this.mapStuntDoubles(model);

    const result = this.getStuntDoubleInfo(stuntDoubles);
    const idsToReplace = result.idsToReplace;
    let highestId = result.highestId;

    let modelString = JSON.stringify(model);
    idsToReplace.forEach((idOriginal) => {
      const nextId = highestId + 1;
      modelString = modelString.replace(idOriginal, nextId);
      highestId = nextId;
    });

    return { ...state, ...{ model: JSON.parse(modelString) } };
  }

  getStuntDoubleInfo(stuntDoubles) {
    let highestId = 0;
    const idsToReplace = [];
    /* eslint-disable guard-for-in */
    for (const key in stuntDoubles) {
      const idValue = stuntDoubles[key];
      const isNumber = idValue.indexOf('-') === -1;
      if (isNumber) {
        const id = parseInt(idValue, 10);
        if (id > highestId) {
          highestId = id;
        }
      } else {
        idsToReplace.push(idValue);
      }
    }

    idsToReplace.sort();

    return {
      idsToReplace,
      highestId
    };
  }

  mapStuntDoubles(model) {
    const idToken = '"id":';
    const modelString = JSON.stringify(model);

    let currentIndex = 0;
    const maxLength = modelString.length;

    const mapIds = {};
    while (currentIndex < (maxLength - 1)) {
      const nextIdPos = modelString.indexOf(idToken, currentIndex);
      if (nextIdPos > -1) {
        const valueStartPos = nextIdPos + idToken.length;
        let valueEndPos = modelString.indexOf(',', valueStartPos);
        if (valueEndPos === -1) {
          valueEndPos = modelString.indexOf('}', valueStartPos);
        }
        const idValue = modelString.substring(valueStartPos, valueEndPos);

        mapIds[valueStartPos] = idValue;

        currentIndex = nextIdPos + idValue.length;
      } else {
        break;
      }
    }

    return mapIds;
  }

  async nukeAndPave() {
    if (this.stateIndex.length > 0) {
      await this.rollbackTo(this.stateIndex[0]);
    }

    return { result: 'Success' };
  }
}

export default new StateService();

