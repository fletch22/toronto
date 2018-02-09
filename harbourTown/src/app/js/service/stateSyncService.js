import Service from './Service';
import util from '../util/util';
import c from '../../../util/c';
import 'babel-core/register';
import 'babel-polyfill';

class StateSyncService extends Service {

  constructor() {
    super();
    this.saveState = this.saveState.bind(this);
    this.getMostRecentHistoricalState = this.getMostRecentHistoricalState.bind(this);
    this.getHistoricalState = this.getHistoricalState.bind(this);
    this.getHistoricalStateFromNode = this.getHistoricalStateFromNode.bind(this);
    this.saveStateArray = this.saveStateArray.bind(this);
  }

  getEarliestState() {
    return this.getEarliestStateFromNode();
  }

  getEarliestStateFromNode() {
    return this.fetch(`${this.getNodeServerRootUrl()}/states?action=getEarliest`, 'post');
  }

  async rollbackToStateId(stateId, state) {
    return this.fetch(`${this.getNodeServerRootUrl()}/states/${stateId}?action=rollbackTo`, 'post');
  }

  saveStateArray(stateArray) {
    return this.fetch(`${this.getNodeServerRootUrl()}/stateArrays`, 'post', stateArray);
  }

  saveState(statePackage) {
    return this.fetch(`${this.getNodeServerRootUrl()}/statePackages/`, 'post', statePackage);
  }

  async getHistoricalState(index) {
    const optionResult = await this.getHistoricalStateFromNode(index);

    if (!optionResult.isPresent) {
      throw new Error('Encountered problem getting moset recent historical state. No state found.');
    }
    return optionResult.value;
  }

  getHistoricalStateFromNode(index) {
    return this.fetch(`${this.getNodeServerRootUrl()}/stateIndexes/${index}`, 'get');
  }

  async getMostRecentHistoricalState() {
    const optionResult = await this.fetch(`${this.getNodeServerRootUrl()}/states?action=getMostRecentHistoricalState`, 'post');

    return this.unwrapState(optionResult);
  }

  unwrapState(optionalResult) {
    if (!optionalResult.isPresent) {
      throw new Error('Encountered problem getting moset recent historical state. No state found.');
    }

    return optionalResult.value;
  }
}

export default new StateSyncService();
