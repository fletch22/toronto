import Service from './service';

class StateSyncService extends Service {

  getEarliestState() {
    return this.fetch(`${this.getOrbServerRootUrl()}/component/states?action=getEarliest`, 'post');
  }

  rollbackToTransaction(transactionId) {
    return this.fetch(`${this.getOrbServerRootUrl()}/transaction/${transactionId}?action=rollbackTo`, 'post');
  }

  rollbackToStateId(stateId) {
    return this.fetch(`${this.getOrbServerRootUrl()}/component/states/${stateId}?action=rollbackTo`, 'post');
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

  getState(stateId) {
    return this.fetch(`${this.getOrbServerRootUrl()}/component/states/${stateId}`, 'get');
  }

  determineLastGoodState(mostRecentSubmittedBlocks) {
    return this.fetch(`${this.getOrbServerRootUrl()}/component/determineLastGoodState/`, 'post', mostRecentSubmittedBlocks);
  }
}

export default new StateSyncService();
