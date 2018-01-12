import fileService from './fileService';
import path from 'path';
import fs from 'fs';
import Optional from 'optional-js';
import stateService from './stateService';
import winston from 'winston';

const persistRootPath = fileService.getPersistRootPath();
export const sessionFilename = 'session.json';
const sessionFilePath = path.join(persistRootPath, sessionFilename);
const defaultEncoding = 'utf8';

class SessionService {
  persistSession(sessionKey) {
    const session = {
      lastSavedSessionKey: sessionKey,
      sessionFileCreateDate: new Date().getTime()
    };

    return fileService.persistByOverwriting(sessionFilePath, JSON.stringify(session));
  }

  initializeSession(sessionKey) {
    winston.debug('About to persist session.');
    return this.persistSession(sessionKey).then(() => {
      winston.debug('About to call reindex.');
      return stateService.reindexLogFile();
    });
  }


  persistSessionIfMissing(sessionKey) {
    if (!fs.existsSync(sessionFilePath)) {
      this.initializeSession(sessionKey);
    }
  }

  getCurrentSessionKey() {
    let optionalResult = Optional.empty();
    if (fileService.exists(sessionFilePath)) {
      const contents = fileService.readFile(sessionFilePath);

      const session = JSON.parse(contents);
      optionalResult = Optional.ofNullable(session.lastSavedSessionKey);
    }

    return optionalResult;
  }

  getSessionFilePath() {
    return sessionFilePath;
  }
}

export default new SessionService();
