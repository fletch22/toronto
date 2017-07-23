import ModelToStateGenerator from '../stores/ModelToStateGenerator';
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
        state.typeLiveViewAttributes = responseData.typeLiveViewAttributes;

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
          c.l(state.serverStartupTimestamp, 'state.serverStartupTimestamp: ');

          const startupTimestamp = data.startupTimestamp;
          if (state.serverStartupTimestamp !== startupTimestamp) {
            console.debug('It appears that the server timestamp and the state timestamp are out of sync. This can happen if the state has been restored from backup.' +
              'To fix this, the system will set the current startup timestamp to the server timestamp.');
            state.serverStartupTimestamp = startupTimestamp;
          }

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
