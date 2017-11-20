import fs from 'fs';
import 'datejs';
import durations from 'durations';
import format from 'string-template';
import srcRoot from '../../srcRoot';
import path from 'path';

const persistDateFormat = 'yyyy-MM-dd-HH-mm-ss-tt';
const stopwatch = durations.stopwatch();
export const persistRootPath = path.resolve(srcRoot, '..', 'temp');
const filePathTemplate = path.join(persistRootPath, 'stateLog-{persistFilenamePart}.txt');
const sessionFilePath = path.join(persistRootPath, 'session.txt');

class PersistToDiskServer {

  constructor() {
    this.writeToFile = this.writeToFile.bind(this);
    this.getPersistFilenamePart = this.getPersistFilenamePart.bind(this);
    this.groupAndWrite = this.groupAndWrite.bind(this);
    this.composeFilePathFromSessionKey = this.composeFilePathFromSessionKey.bind(this);
    this.saveDataToFile = this.saveDataToFile.bind(this);
    this.groupByTimestamp = this.groupByTimestamp.bind(this);
    this.persistState = this.persistState.bind(this);
    this.ensureSessionPersisted = this.ensureSessionPersisted.bind(this);
  }

  writeToFile(filePath, data) {
    fs.open(filePath, 'a', (errOpen, fd) => {
      if (!errOpen) {
        fs.writeFile(fd, data, (err) => {
          // Force the file to be flushed
          if (!err) {
            fs.fdatasync(fd, () => {
              fs.close(fd, () => {
                stopwatch.stop();
                const duration = stopwatch.duration();
                console.log(`Took ${duration}`);
              });
            });
          } else {
            console.log(`Error Message: ${err.message}`);
            throw new Error(err);
          }
        });
      } else {
        console.log(`Error Message: ${errOpen.message}`);
        throw new Error(errOpen);
      }
    });
  }

  getPersistFilenamePart(serverStartupTimestamp) {
    const startupTimestamp = new Date(parseInt(serverStartupTimestamp, 10));
    return `${startupTimestamp.toString(persistDateFormat)}`;
  }

  groupAndWrite(persistGrouping) {
    for (const key in persistGrouping) {
      if (persistGrouping.hasOwnProperty(key)) {
        let combinedData = '';

        const arrayStates = persistGrouping[key];
        arrayStates.forEach((info) => {
          const json = JSON.stringify(info.state); // NOTE: 2017-11-17: There should be no carriage returns here at this point.
          combinedData += `${json}\n`;
        });
        this.writeToFile(this.composeFilePathFromSessionKey(key), combinedData);
      }
    }
  }

  composeFilePathFromSessionKey(key) {
    return format(filePathTemplate, { persistFilenamePart: this.getPersistFilenamePart(key) });
  }

  saveDataToFile(statesArray) {
    const persistGrouping = this.groupByTimestamp(statesArray);

    this.groupAndWrite(persistGrouping);
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
    stopwatch.reset();
    stopwatch.start();

    this.saveDataToFile(stateArray.states);
  }

  ensureSessionPersisted(sessionKey) {
    const session = {
      lastSavedSessionKey: sessionKey,
      sessionFileCreateDate: new Date().getTime()
    };

    this.writeToFile(sessionFilePath, JSON.stringify(session));
  }
}

export default new PersistToDiskServer();
