import Service from './Service';
import util from '../util/util';
import c from '../../../util/c';

class StateSyncService extends Service {

  constructor() {
    super();
    this.saveState = this.saveState.bind(this);
    this.saveStateToNode = this.saveStateToNode.bind(this);
    this.getMostRecentHistoricalStateFromNode = this.getMostRecentHistoricalStateFromNode.bind(this);
    this.getHistoricalState = this.getHistoricalState.bind(this);
    this.getHistoricalStateFromNode = this.getHistoricalStateFromNode.bind(this);
    this.saveStateArrayToNode = this.saveStateArrayToNode.bind(this);
  }

  getEarliestState() {
    return this.fetch(`${this.getOrbServerRootUrl()}/component/states?action=getEarliest`, 'post');
  }

  rollbackToStateId(stateId) {
    this.rollbackToStateIdOnNode(stateId);
    return this.fetch(`${this.getOrbServerRootUrl()}/component/states/${stateId}?action=rollbackTo`, 'post');
  }

  rollbackToStateIdOnNode(stateId) {
    return this.fetch(`${this.getNodeServerRootUrl()}/states/${stateId}?action=rollbackTo`, 'post');
  }

  saveStateArray(stateArray) {
    this.saveStateArrayToNode(stateArray).then((nodeResponse) => {
      c.l(nodeResponse);
    });

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
    this.getHistoricalStateFromNode(index);
    return this.fetch(`${this.getOrbServerRootUrl()}/component/stateHistory/${index}`, 'get');
  }

  getHistoricalStateFromNode(index) {
    return this.fetch(`${this.getNodeServerRootUrl()}/stateIndexes/${index}`, 'get');
  }

  getMostRecentHistoricalState() {
    this.getMostRecentHistoricalStateFromNode().then((result) => {
      if (result.foundState) {
        const stateHashCode = util.hashCode(result.state);
        c.l(`Node state: ${stateHashCode} ...`);
      }
    });

    return this.fetch(`${this.getOrbServerRootUrl()}/component/mostRecentStateHistory`, 'get');
  }

  getMostRecentHistoricalStateFromNode() {
    return this.fetch(`${this.getNodeServerRootUrl()}/states/mostRecentHistoricalState`, 'get');
  }

  // NOTE: 2017-12-02: Deprecated
  determineLastGoodState(mostRecentSubmittedBlocks) {
    throw new Error('determineLastGoodState is being deprecated. If you see this error message, consider either keeping or removing it.');
    // return this.fetch(`${this.getOrbServerRootUrl()}/component/determineLastGoodState/`, 'post', mostRecentSubmittedBlocks);
  }

  saveSessionToNode(serverStartupTimestamp) {
    return this.fetch(`${this.getNodeServerRootUrl()}/sessions/${serverStartupTimestamp}`, 'put');
  }
}

export default new StateSyncService();
