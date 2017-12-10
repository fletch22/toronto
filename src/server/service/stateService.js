import moment from 'moment';
import format from 'string-template';
import path from 'path';
import fileService from './fileService';
import sessionService from './sessionService';
import { stopwatch } from 'durations';
import objectUtil from '../util/objectUtil';
import fs from 'fs';
import readline from 'readline';
import Optional from 'optional-js';
import 'babel-polyfill';
import util from '../../util/util';
import winston from 'winston';

const watch = stopwatch();
const persistDateFormat = 'YYYY-MM-DD-HH-mm-ss-A';
export const persistRootPath = fileService.getPersistRootPath();
export const stateLogPrefix = 'stateLog-';
export const stateLogSuffix = '.txt';
const filePathTemplate = path.join(persistRootPath, `${stateLogPrefix}{persistFilenamePart}${stateLogSuffix}`);

const STATE_KEY = 'dk89h22njkfdu90jo21kl231kl2199';

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

    this.stateIndex = [];
  }

  getPersistFilenamePart(serverStartupTimestamp) {
    const startupTimestamp = new Date(parseInt(serverStartupTimestamp, 10));
    return `${moment(startupTimestamp.toISOString()).format(persistDateFormat)}`;
  }

  groupAndWrite(persistGrouping) {
    const allWrites = [];
    for (const key in persistGrouping) {
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
    stateInfo[STATE_KEY] = statePackage.clientId;
    stateInfo.state = statePackage.state;

    return stateInfo;
  }

  getStateFromPersistState(persistState) {
    return persistState.state;
  }

  writeStateToFile(key, stateString) {
    sessionService.persistSessionIfMissing(key);
    this.saveToStateIndex(stateString);
    return fileService.writeToFile(this.composeFilePathFromSessionKey(key), stateString);
  }

  composeFilePathFromSessionKey(key) {
    return format(filePathTemplate, { persistFilenamePart: this.getPersistFilenamePart(key) });
  }

  saveDataToFile(statesArray) {
    const persistGrouping = this.groupByTimestamp(statesArray);

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
      const serverStartTimestamp = state.serverStartupTimestamp;
      if (!persistGrouping[serverStartTimestamp]) {
        persistGrouping[serverStartTimestamp] = [];
      }
      persistGrouping[serverStartTimestamp].push(state);
    });
    return persistGrouping;
  }

  persistStateArrays(stateArray) {
    winston.info('Persist state arrays.');
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
    winston.info('Persist package.');

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

  findMostRecentStateInFile() {
    winston.info('Find most recent state in file.');

    return new Promise((resolve) => {
      let optionalResult = util.getOptionalLiteral(null);

      const optionalFilePath = this.getFilePathOfCurrentSessionLog();
      if (optionalFilePath.isPresent()) {
        const filepath = optionalFilePath.get();
        if (fs.exists(filepath)) {
          const lineReader = this.createLineReadStream(optionalFilePath.get());
          let lastLine;

          lineReader.on('line', (line) => {
            lastLine = line;
          });

          lineReader.on('close', () => {
            optionalResult = util.getOptionalLiteral(JSON.parse(lastLine));
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

  getFilePathOfCurrentSessionLog() {
    const optionalSessionKey = sessionService.getCurrentSessionKey();

    let optionalFilePath = Optional.empty();
    if (optionalSessionKey.isPresent()) {
      optionalFilePath = Optional.ofNullable(this.composeFilePathFromSessionKey(optionalSessionKey.get()));
      winston.info(`Session log: ${optionalFilePath.get()}`);
    }
    return optionalFilePath;
  }

  createLineReadStream(filepath) {
    return readline.createInterface({
      input: fs.createReadStream(filepath)
    });
  }

  getTotalStatesInSessionFile() {
    return new Promise((resolve, reject) => {
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
    winston.info(`Total lines: ${totalLines}: typeof: ${typeof totalLines}`);
    const stopOnIndex = totalLines + (index * -1);

    const optionalFilePath = this.getFilePathOfCurrentSessionLog();
    return new Promise((resolve) => {
      if (optionalFilePath.isPresent()) {
        winston.info(`Fp: ${optionalFilePath.get()}`);
        const filePath = optionalFilePath.get();
        if (fs.exists(filePath)) {
          const lineReader = this.createLineReadStream(optionalFilePath.get());
          let persistedState;

          let count = 0;
          winston.info(`soi: ${stopOnIndex}`);
          lineReader.on('line', (line) => {
            if (stopOnIndex === count) {
              persistedState = line;
              lineReader.close();
            }
            count++;
            winston.info(`count: ${count}`);
          });

          lineReader.on('close', () => {
            winston.info('Close called.');
            resolve(Optional.ofNullable(this.getStateFromPersistState(persistedState)));
          });
        } else {
          resolve(Optional.empty());
        }
      } else {
        resolve(Optional.empty());
      }
    });
  }

  reindexLogFile() {
    return new Promise((resolve, reject) => {
      try {
        let optionalResult = util.getOptionalLiteral(null);

        const optionalFilePath = this.getFilePathOfCurrentSessionLog();
        if (optionalFilePath.isPresent()) {
          const logPath = optionalFilePath.get();
          if (fs.exists(logPath)) {
            const lineReader = this.createLineReadStream(logPath);
            let lastLine;

            this.stateIndex = [];

            lineReader.on('line', (line) => {
              lastLine = line;
              this.saveToStateIndex(line);
            });

            lineReader.on('close', () => {
              optionalResult = util.getOptionalLiteral(JSON.parse(lastLine));
              resolve(optionalResult);
            });
          }
        } else {
          resolve(optionalResult);
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  saveToStateIndex(stateString) {
    const indexOfKey = stateString.indexOf(STATE_KEY);
    if (indexOfKey > -1) {
      const startIndex = indexOfKey + STATE_KEY.length + 1;
      const quoteFirstIndex = stateString.indexOf('"', startIndex);
      const nextQuoteIndex = stateString.indexOf('"', quoteFirstIndex + 1);
      const clientId = stateString.substring(quoteFirstIndex + 1, nextQuoteIndex);
      this.stateIndex.push(clientId);
    }
  }

  getStateByClientId(clientId) {
    return Promise.resolve(Optional.ofNullable(clientId));
  }
}

export default new StateService();
