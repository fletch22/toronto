import Service from './Service';
import util from '../util/util';
import c from '../../../util/c';
import 'babel-core/register';
import 'babel-polyfill';

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

  async getEarliestState() {
    const stateFromNode = await this.getEarliestStateFromNode();

    return this.fetch(`${this.getOrbServerRootUrl()}/component/states?action=getEarliest`, 'post');
  }

  getEarliestStateFromNode() {
    return this.fetch(`${this.getNodeServerRootUrl()}/states?action=getEarliest`, 'post');
  }

  async rollbackToStateId(stateId, state) {
    c.l('Rolling back...');
    try {
      const resultNew = await this.rollbackToStateIdOnNode(stateId);
      if (resultNew.isPresent) {
        c.l(`RB result.value: ${resultNew.value}`);
        const stateHashCode = util.hashCode(resultNew.value);
        c.l(`RB Node Hash: ${stateHashCode}`);
        const stringState = JSON.stringify(state);
        c.l(`RB Stringstate: ${stringState}`);
        const stateHashCodeOld = util.hashCode(stringState);
        c.l(`RB local Hash: ${stateHashCodeOld}`);
      }
    } catch (error) {
      c.l(`Error from attempting to roll back on node: ${error.message}`);
    }

    return this.fetch(`${this.getOrbServerRootUrl()}/component/states/${stateId}?action=rollbackTo`, 'post');
  }

  rollbackToStateIdOnNode(stateId) {
    return this.fetch(`${this.getNodeServerRootUrl()}/states/${stateId}?action=rollbackTo`, 'post');
  }

  saveStateArray(stateArray) {
    this.saveStateArrayToNode(stateArray).then((nodeResponse) => {
      c.lo(nodeResponse);
    });

    return this.fetch(`${this.getOrbServerRootUrl()}/component/statePallet`, 'put', stateArray);
  }

  saveStateArrayToNode(stateArray) {
    return this.fetch(`${this.getNodeServerRootUrl()}/stateArrays`, 'post', stateArray);
  }

  async saveState(statePackage) {
    const javaState = await this.fetch(`${this.getOrbServerRootUrl()}/component/statePackage`, 'put', statePackage);

    const nodeStatePackage = { ...statePackage, ...{ state: JSON.stringify(javaState) }, ...{ originalState: statePackage.state } };
    await this.saveStateToNode(nodeStatePackage);

    return javaState;
  }

  saveStateToNode(statePackage) {
    return this.fetch(`${this.getNodeServerRootUrl()}/statePackages/`, 'post', statePackage);
  }

  async getHistoricalState(index) {
    let optionResult = null;
    try {
      optionResult = await this.getHistoricalStateFromNode(index);
      if (optionResult.isPresent) {
        c.l(`getHistoricalStateFromNode: ${optionResult.value}`);
        const stateHashCode = util.hashCode(optionResult.value);
        c.l(`Historical Nodes state: ${stateHashCode} ...`);
      }
    } finally {
      // Do nothing
    }

    try {
      if (!optionResult || (optionResult && !optionResult.isPresent)) {
        c.l('Returning null historical.');
        return Promise.resolve({ state: null });
      } else {
        const oldResult = await this.fetch(`${this.getOrbServerRootUrl()}/component/stateHistory/${index}`, 'get');

        if (!!oldResult && !!oldResult.state) {
          const stateHashCode = util.hashCode(oldResult.state);
          c.l(`Historical Java state: ${stateHashCode} ...`);
        }
        return Promise.resolve(oldResult);
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }

  getHistoricalStateFromNode(index) {
    return this.fetch(`${this.getNodeServerRootUrl()}/stateIndexes/${index}`, 'get');
  }

  async getMostRecentHistoricalState() {
    const optionResult = await this.getMostRecentHistoricalStateFromNode();
    if (optionResult.isPresent) {
      const stateHashCode = util.hashCode(optionResult.value.state);
      c.l(`Nodes state: ${stateHashCode} ...`);
    }

    return this.fetch(`${this.getOrbServerRootUrl()}/component/mostRecentStateHistory`, 'get');
  }

  getMostRecentHistoricalStateFromNode() {
    return this.fetch(`${this.getNodeServerRootUrl()}/states?action=getMostRecentHistoricalState`, 'post');
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
