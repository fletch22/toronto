import persistToDiskService from './persistToDiskService';
import path from 'path';
import fs from 'fs';
import Optional from 'optional-js';

const persistRootPath = persistToDiskService.getPersistRootPath();
export const sessionFilePath = path.join(persistRootPath, 'session.json');
const defaultEncoding = 'utf8';

class PersistSessionService {
  ensureSessionPersisted(sessionKey) {
    const session = {
      lastSavedSessionKey: sessionKey,
      sessionFileCreateDate: new Date().getTime()
    };

    return persistToDiskService.persistByOverwriting(sessionFilePath, JSON.stringify(session));
  }

  getCurrentSessionKey() {
    let optionalResult = Optional.empty();
    if (fs.exists(sessionFilePath)) {
      const contents = fs.readFileSync(sessionFilePath, defaultEncoding);

      const session = JSON.parse(contents);
      optionalResult = Optional.ofNullable(session.lastSavedSessionKey);
    }

    return optionalResult;
  }
}

export default new PersistSessionService();
