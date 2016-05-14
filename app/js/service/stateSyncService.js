import Service from './service';

class StateSyncService extends Service {

  rollbackToTransaction(transactionId) {
    return this.fetch(`${this.getOrbServerRootUrl()}/transaction/${transactionId}?action=rollbackTo`, 'post');
  }

  saveStateArray(stateArray) {
    return this.fetch(`${this.getOrbServerRootUrl()}/component/statePallet`, 'put', stateArray);
  }

  saveState(statePackage) {
    return this.fetch(`${this.getOrbServerRootUrl()}/component/statePackage`, 'put', statePackage);
  }

  saveStateSynchronous(statePackage) {
    return this.fetchSynchronous(`${this.getOrbServerRootUrl()}/component/statePackage`, 'put', statePackage);
  }

  getHistoricalState(index) {
    return this.fetch(`${this.getOrbServerRootUrl()}/component/stateHistory/${index}`, 'get');
  }

  getMostRecentHistoricalState() {
    return this.fetch(`${this.getOrbServerRootUrl()}/component/mostRecentStateHistory`, 'get');
  }
}

export default new StateSyncService();
