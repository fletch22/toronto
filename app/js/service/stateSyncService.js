import Service from './service';

class StateSyncService extends Service {

  rollbackAndFetchStateHistory(numberStatesToFetch) {
    return this.fetch(`${this.getOrbServerRootUrl()}/staterollbackAndFetch?numberStatesToFetch=${numberStatesToFetch}`, 'post');
  }

  saveState(statePackage) {
    return this.fetch(`${this.getOrbServerRootUrl()}/state`, 'put', statePackage);
  }
}


export default new StateSyncService();
