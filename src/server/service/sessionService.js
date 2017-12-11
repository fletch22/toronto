import fileService from './fileService';
import path from 'path';
import fs from 'fs';
import Optional from 'optional-js';
import stateService from './stateService';

const persistRootPath = fileService.getPersistRootPath();
const sessionFilePath = path.join(persistRootPath, 'session.json');
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
    return this.persistSession(sessionKey).then(() => stateService.reindexLogFile());
  }

  persistSessionIfMissing(sessionKey) {
    if (!fs.existsSync(sessionFilePath)) {
      this.persistSession(sessionKey);
    }
  }

  getCurrentSessionKey() {
    let optionalResult = Optional.empty();
    if (fs.existsSync(sessionFilePath)) {
      const contents = fs.readFileSync(sessionFilePath, defaultEncoding);

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
