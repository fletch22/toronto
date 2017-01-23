import ModelToStateGenerator from '../stores/modelToStateGenerator';
import RestService from '../service/restService';
import stateSyncService from '../service/stateSyncService';
import defaultState from '../state/defaultState';

class StateRetriever {

  deriveState() {
    return RestService.getRoot()
      .then((responseData) => {
        const state = defaultState.getInstance();

        const modelToStateGenerator = new ModelToStateGenerator(state);
        modelToStateGenerator.process(responseData.appContainer);
        state.serverStartupTimestamp = responseData.startupTimestamp;

        return state;
      })
      .catch((error) => {
        console.debug('Got error calling getAppContainer.');
        return Promise.reject(error);
      });
  }

  getCurrent() {
    const outerPromise = new Promise((resolve, reject) => {
      const promise = stateSyncService.getMostRecentHistoricalState();

      promise.catch((error) => {
        console.error(error.stack);
        reject(error);
      });

      promise.then((data) => {
        const state = JSON.parse(data.state);

        if (state === null) {
          const promiseInner = this.deriveState();

          promiseInner.then((stateInner) => {
            resolve(stateInner);
          });

          promiseInner.catch((error) => {
            reject(error);
          });
        } else {
          resolve(state);
        }
      });
    });

    return outerPromise;
  }

  getState(stateId) {
    return stateSyncService.getState(stateId);
  }
}

export default new StateRetriever();
