import persistToDiskService from './persistToDiskService';
import path from 'path';

const persistRootPath = persistToDiskService.getPersistRootPath();
const sessionFilePath = path.join(persistRootPath, 'session.json');

class PersistSessionService {
  ensureSessionPersisted(sessionKey) {
    const session = {
      lastSavedSessionKey: sessionKey,
      sessionFileCreateDate: new Date().getTime()
    };

    return persistToDiskService.persistByOverwriting(sessionFilePath, JSON.stringify(session));
  }
}

export default new PersistSessionService();
