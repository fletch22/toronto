import persistToDiskService from './persistToDiskService';
import path from 'path';
import fs from 'fs';

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
    const contents = fs.readFileSync(sessionFilePath, defaultEncoding);

    const session = JSON.parse(contents);
    return session.lastSavedSessionKey;
  }
}

export default new PersistSessionService();
