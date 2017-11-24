import 'datejs';
import format from 'string-template';
import path from 'path';
import persistToDiskService from './persistToDiskService';
import persistSessionService from './persistSessionService';
import { stopwatch } from 'durations';
import objectUtil from '../util/objectUtil';

const watch = stopwatch();
const persistDateFormat = 'yyyy-MM-dd-HH-mm-ss-tt';
export const persistRootPath = persistToDiskService.getPersistRootPath();
const filePathTemplate = path.join(persistRootPath, 'stateLog-{persistFilenamePart}.txt');


class PersistStateToDiskService {

  constructor() {
    this.getPersistFilenamePart = this.getPersistFilenamePart.bind(this);
    this.groupAndWrite = this.groupAndWrite.bind(this);
    this.composeFilePathFromSessionKey = this.composeFilePathFromSessionKey.bind(this);
    this.saveDataToFile = this.saveDataToFile.bind(this);
    this.groupByTimestamp = this.groupByTimestamp.bind(this);
    this.persistState = this.persistState.bind(this);
    this.persistSession = this.persistSession.bind(this);
    this.sortSessionKeys = this.sortSessionKeys.bind(this);
  }

  getPersistFilenamePart(serverStartupTimestamp) {
    const startupTimestamp = new Date(parseInt(serverStartupTimestamp, 10));
    return `${startupTimestamp.toString(persistDateFormat)}`;
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
        allWrites.push(persistToDiskService.writeToFile(this.composeFilePathFromSessionKey(key), combinedData));
      }
    }
    return Promise.all(allWrites);
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

  persistState(stateArray) {
    watch.reset();
    watch.start();

    return this.saveDataToFile(stateArray.states).then((persistedSessionStateKeys) => {
      return this.persistSession(persistedSessionStateKeys);
    });
  }

  persistSession(persistedSessionStateKeys) {
    return persistSessionService.ensureSessionPersisted(persistedSessionStateKeys)
      .then((data) => {
        watch.stop();
        const duration = watch.duration();
        c.l(`Write duration: ${duration}`);
        return Promise.resolve(data);
      });
  }

  findMostRecentHistoricalState() {
    return Promise.reject(new Error('foo'));
  }
}

export default new PersistStateToDiskService();
