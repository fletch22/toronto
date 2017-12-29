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
import c from '../../util/c';

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
    winston.debug('Find most recent state in file.');

    return new Promise((resolve) => {
      let optionalResult = util.getOptionalLiteral(null);

      const optionalFilePath = this.getFilePathOfCurrentSessionLog();
      if (optionalFilePath.isPresent()) {
        const filepath = optionalFilePath.get();
        if (fs.existsSync(filepath)) {
          winston.debug(`filepath found: ${filepath}`);
          const lineReader = this.createLineReadStream(filepath);
          let lastLine;

          lineReader.on('line', (line) => {
            lastLine = line;
          });

          lineReader.on('close', () => {
            let parsedLine = null;
            try {
              parsedLine = JSON.parse(lastLine);
              optionalResult = util.getOptionalLiteral(parsedLine);
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
    winston.debug('getStateByIndex called.');
    winston.debug(`typeof index: ${typeof index}`);

    const optionalTotalLines = await this.getTotalStatesInSessionFile();

    if (!optionalTotalLines.isPresent()) {
      throw new Error('There are no session states in the system.');
    }

    const totalLines = optionalTotalLines.get();
    winston.info(`Total lines: ${totalLines}: typeof: ${typeof totalLines}; index: ${index}`);
    const stopOnIndex = (totalLines - 1) + (index * -1);

    const optionalFilePath = this.getFilePathOfCurrentSessionLog();
    return new Promise((resolve) => {
      if (optionalFilePath.isPresent()) {
        const filePath = optionalFilePath.get();
        winston.debug(`Fp: ${filePath}`);
        if (fs.existsSync(filePath)) {
          const lineReader = this.createLineReadStream(optionalFilePath.get());
          let persistedState;

          let count = 0;
          winston.debug(`${typeof stopOnIndex}`);

          winston.info(`soi: ${stopOnIndex}`);
          lineReader.on('line', (line) => {
            winston.info(`Count: ${count}`);
            if (stopOnIndex === count) {
              persistedState = line;
              winston.debug('Closing lr.');
              lineReader.close();
            }
            count++;
          });

          lineReader.on('close', () => {
            if (!!persistedState) {
              winston.info(`Close called. ${persistedState.length}`);
              resolve(Optional.ofNullable(this.getStateFromPersistState(JSON.parse(persistedState))));
            } else {
              resolve(Optional.empty());
            }
          });
        } else {
          resolve(Optional.empty());
        }
      } else {
        resolve(Optional.empty());
      }
    });
  }

  async reindexLogFile() {
    try {
      let optionalResult = util.getOptionalLiteral(null);

      const optionalFilePath = this.getFilePathOfCurrentSessionLog();
      if (optionalFilePath.isPresent()) {
        const logPath = optionalFilePath.get();
        c.l(`Log path: ${logPath}`);
        this.stateIndex = [];
        if (fs.existsSync(logPath)) {
          const optionalTotalLines = await this.getTotalStatesInSessionFile();
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

            return Promise.resolve(optionalResult);
          });
        }
      } else {
        return Promise.resolve(optionalResult);
      }
    } catch (error) {
      c.l(`Error: ${error.message}`);
      return Promise.reject(error);
    }
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

  async rollbackTo(clientId) {
    let optionalState = Optional.empty();
    try {
      optionalState = await this.getStateByClientId(clientId);
    } catch (error) {
      winston.info(error.message);
    }
    winston.info(`State to rollback to is present: ${optionalState.isPresent()}`);

    if (optionalState.isPresent()) {
      const result = optionalState.get();
      await this.truncateLog(result.stateIndex);
      return Promise.resolve(Optional.ofNullable(result.state));
    }

    return optionalState;
  }

  truncateLog(index) {
    return new Promise((resolve) => {
      const logPath = this.getFilePathOfCurrentSessionLog();
      const tmpPath = `${logPath}.tmp`;
      const lineReader = this.createLineReadStream(logPath);

      this.stateIndex = [];

      let count = 0;
      lineReader.on('line', (line) => {
        if (count < index) {
          fileService.writeToFile(tmpPath, line);
          lineReader.close();
        }
        count++;
      });

      lineReader.on('close', () => {
        // Rename tmp file to actual log file.
      });
    });
  }

  async getStateByClientId(clientId) {
    const stateIndex = this.stateIndex.indexOf(clientId);
    const optionalTotalLines = await this.getTotalStatesInSessionFile();
    winston.info(`Called getStateByClientId. Indexes: ${stateIndex}`);
    const totalLines = optionalTotalLines.get();
    winston.info(`Tot lines: ${totalLines}`);

    const optionalState = await this.getStateByIndex((totalLines - 1) - stateIndex);

    let optionalResult = Optional.empty();
    if (optionalState.isPresent()) {
      const state = optionalState.get();
      const result = {
        state,
        stateIndex,
        totalLines
      };
      winston.info(`state found: ${JSON.stringify(state).length}`);

      optionalResult = Optional.ofNullable(result);
    }

    return Promise.resolve(optionalResult);
  }
}

export default new StateService();

