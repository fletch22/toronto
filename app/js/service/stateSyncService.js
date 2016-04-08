import Service from './service';

class StateSyncService extends Service {

  rollbackAndFetchStateHistory(numberStatesToFetch) {
    return this.fetch(`${this.getOrbServerRootUrl()}/staterollbackAndFetch?numberStatesToFetch=${numberStatesToFetch}`, 'post');
  }

  saveState(statePackage) {
    return this.fetch(`${this.getOrbServerRootUrl()}/state`, 'put', statePackage);
  }

  getStateMostRecent() {
    return this.fetch(`${this.getOrbServerRootUrl()}/stateMostRecent`, 'get');
  }
}

export default new StateSyncService();
