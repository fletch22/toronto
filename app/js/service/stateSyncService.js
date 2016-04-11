import Service from './service';

class StateSyncService extends Service {

  rollbackAndFetchStateHistory(numberStatesToFetch) {
    return this.fetch(`${this.getOrbServerRootUrl()}/staterollbackAndFetch?numberStatesToFetch=${numberStatesToFetch}`, 'post');
  }

  saveState(statePackage) {
    return this.fetch(`${this.getOrbServerRootUrl()}/state`, 'put', statePackage);
  }

  getHistoricalState(index) {
    return this.fetch(`${this.getOrbServerRootUrl()}/stateHistory/${index}`, 'get');
  }
}

export default new StateSyncService();
