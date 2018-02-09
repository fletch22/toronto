import ModelToStateGenerator from '../stores/ModelToStateGenerator';
import RestService from '../service/restService';
import stateSyncService from '../service/stateSyncService';
import defaultState from '../state/defaultState';
import deepDiff from 'deep-diff';
import util from '../util/util';

class StateRetriever {

  getCurrent() {
    const outerPromise = new Promise((resolve, reject) => {
      return stateSyncService.getMostRecentHistoricalState().then((data) => {
        resolve(data.state);
      }).catch((error) => {
        console.error(error.stack);
        reject(error);
      });
    });

    return outerPromise;
  }
}

export default new StateRetriever();
