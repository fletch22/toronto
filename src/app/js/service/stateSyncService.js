import Service from './Service';

class StateSyncService extends Service {

  constructor() {
    super();
    this.saveState = this.saveState.bind(this);
    this.saveStateToNode = this.saveStateToNode.bind(this);
  }

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
    return this.fetch(`${this.getNodeServerRootUrl()}/stateArrays`, 'post', stateArray);
  }

  saveState(statePackage) {
    this.saveStateToNode(statePackage);
    return this.fetch(`${this.getOrbServerRootUrl()}/component/statePackage`, 'put', statePackage);
  }

  saveStateToNode(statePackage) {
    return this.fetch(`${this.getNodeServerRootUrl()}/statePackages/`, 'post', statePackage);
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
