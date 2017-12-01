import Service from './Service';

class StateSyncService extends Service {

  getEarliestState() {
    return this.fetch(`${this.getOrbServerRootUrl()}/component/states?action=getEarliest`, 'post');
  }

  rollbackToStateId(stateId) {
    return this.fetch(`${this.getOrbServerRootUrl()}/component/states/${stateId}?action=rollbackTo`, 'post');
  }

  saveStateArray(stateArray) {
    return this.fetch(`${this.getOrbServerRootUrl()}/component/statePallet`, 'put', stateArray);
  }

  saveStateArrayToNode(stateArray) {
    return this.fetch(`${this.getNodeServerRootUrl()}/states`, 'post', stateArray);
  }

  saveState(statePackage) {
    return this.fetch(`${this.getOrbServerRootUrl()}/component/statePackage`, 'put', statePackage);
  }

  getHistoricalState(index) {
    return this.fetch(`${this.getOrbServerRootUrl()}/component/stateHistory/${index}`, 'get');
  }

  getMostRecentHistoricalState() {
    return this.fetch(`${this.getOrbServerRootUrl()}/component/mostRecentStateHistory`, 'get');
  }

  getMostRecentHistoricalStateFromNode() {
    return this.fetch(`${this.getNodeServerRootUrl()}/states/mostRecentHistoricalState`, 'get');
  }

  getState(stateId) {
    return this.fetch(`${this.getOrbServerRootUrl()}/component/states/${stateId}`, 'get');
  }

  determineLastGoodState(mostRecentSubmittedBlocks) {
    return this.fetch(`${this.getOrbServerRootUrl()}/component/determineLastGoodState/`, 'post', mostRecentSubmittedBlocks);
  }

  saveSessionToNode(serverStartupTimestamp) {
    return this.fetch(`${this.getNodeServerRootUrl()}/sessions/${serverStartupTimestamp}`, 'put');
  }
}

export default new StateSyncService();
