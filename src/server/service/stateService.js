import moment from 'moment';
import format from 'string-template';
import path from 'path';
import persistToDiskService from './persistToDiskService';
import persistSessionService from './persistSessionService';
import { stopwatch } from 'durations';
import objectUtil from '../util/objectUtil';
import fs from 'fs';
import readline from 'readline';
import Optional from 'optional-js';
import 'babel-polyfill';
import util from '../../util/util';

const watch = stopwatch();
const persistDateFormat = 'YYYY-MM-DD-HH-mm-ss-A';
export const persistRootPath = persistToDiskService.getPersistRootPath();
export const stateLogPrefix = 'stateLog-';
export const stateLogSuffix = '.txt';
const filePathTemplate = path.join(persistRootPath, `${stateLogPrefix}{persistFilenamePart}${stateLogSuffix}`);

class StateService {

  constructor() {
    this.getPersistFilenamePart = this.getPersistFilenamePart.bind(this);
    this.groupAndWrite = this.groupAndWrite.bind(this);
    this.composeFilePathFromSessionKey = this.composeFilePathFromSessionKey.bind(this);
    this.saveDataToFile = this.saveDataToFile.bind(this);
    this.groupByTimestamp = this.groupByTimestamp.bind(this);
    this.persistStateArrays = this.persistStateArrays.bind(this);
    this.persistSession = this.persistSession.bind(this);
    this.sortSessionKeys = this.sortSessionKeys.bind(this);
    this.createLineReadStream = this.createLineReadStream.bind(this);
    this.writeStateToFile = this.writeStateToFile.bind(this);
    this.persistStatePackage = this.persistStatePackage.bind(this);
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
          const json = JSON.stringify(info.state); // NOTE: 2017-11-17: There should be no carriage returns here at this point.
          combinedData += `${json}\n`;
        });
        allWrites.push(this.writeStateToFile(key, combinedData));
      }
    }
    return Promise.all(allWrites);
  }

  writeStateToFile(key, stateString) {
    return persistToDiskService.writeToFile(this.composeFilePathFromSessionKey(key), stateString);
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
    watch.reset();
    watch.start();

    return this.saveDataToFile(stateArray.states).then((data) => {
      watch.stop();
      const duration = watch.duration();
      c.l(`Write duration: ${duration}`);
      return Promise.resolve(data);
    });
  }

  persistStatePackage(statePackage) {
    return this.writeStateToFile(statePackage.serverStartupTimestamp, JSON.stringify(statePackage.state));
  }

  persistSession(persistedSessionStateKeys) {
    return persistSessionService.ensureSessionPersisted(persistedSessionStateKeys);
  }

  findMostRecentHistoricalFile() {
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
    const optionalFilePath = this.getFilePathOfCurrentSessionLog();

    return new Promise((resolve, reject) => {
      let optionalResult = util.getOptionalLiteral(null);
      if (optionalFilePath.isPresent()) {
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
    });
  }

  createLineReadStream(filepath) {
    return readline.createInterface({
      input: fs.createReadStream(filepath)
    });
  }

  getFilePathOfCurrentSessionLog() {
    const optionalSessionKey = persistSessionService.getCurrentSessionKey();

    let optionalFilePath = Optional.empty();
    if (optionalSessionKey.isPresent()) {
      optionalFilePath = Optional.ofNullable(this.composeFilePathFromSessionKey(optionalSessionKey.get()));
    }
    return optionalFilePath;
  }

  getTotalStatesInSessionFile() {
    const optionalFilePath = this.getFilePathOfCurrentSessionLog();

    return new Promise((resolve, reject) => {
      if (optionalFilePath.isPresent()) {
        const lineReader = this.createLineReadStream(optionalFilePath.get());

        let count = 0;
        lineReader.on('line', () => {
          count++;
        });

        lineReader.on('close', () => {
          resolve(Optional.ofNullable(count));
        });
      } else {
        reject(new Error('Session not found.'));
      }
    });
  }

  async getStateByIndex(index) {
    const optionalTotalLines = await this.getTotalStatesInSessionFile();

    if (!optionalTotalLines.isPresent()) {
      throw new Error('There are not session states to get.');
    }

    const totalLines = optionalTotalLines.get();
    const stopOnIndex = totalLines + index;

    const filePath = this.getFilePathOfCurrentSessionLog();
    const lineReader = this.createLineReadStream(filePath);

    let stateLine;

    let count = 0;
    lineReader.on('line', (line) => {
      if (stopOnIndex === count) {
        stateLine = line;
        lineReader.close();
      }
      count++;
    });

    return new Promise((resolve) => {
      lineReader.on('close', () => {
        c.l('Close called.');
        resolve(Optional.ofNullable(stateLine));
      });
    });
  }
}

export default new StateService();
