import Service from './service';

class StateSyncService extends Service {

  rollbackAndFetchStateHistory(numberStatesToFetch) {
    return this.fetch(`${this.getOrbServerRootUrl()}/component/stateRollbackAndFetch?numberStatesToFetch=${numberStatesToFetch}`, 'post');
  }

  rollbackToTransaction(transactionId) {
    return this.fetch(`${this.getOrbServerRootUrl()}/transaction/${transactionId}?action=rollbackTo`, 'post');
  }

  saveState(statePackage) {
    return this.fetch(`${this.getOrbServerRootUrl()}/component/state`, 'put', statePackage);
  }

  getHistoricalState(index) {
    return this.fetch(`${this.getOrbServerRootUrl()}/component/stateHistory/${index}`, 'get');
  }
}

export default new StateSyncService();
