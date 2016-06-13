import ModelToStateTransformer from '../stores/modelToStateTransformer';
import RestService from '../service/restService';
import stateSyncService from '../service/stateSyncService';

class StateRetriever {

  deriveState() {

    return RestService.getAppContainer()
      .then((responseData) => {
        console.log("Got data.");
        return new ModelToStateTransformer().transform(responseData);
      })
      .catch((error) => {
        console.log("Got error calling getAppContainer.");
        return Promise.reject(error);
      });
  }

  getCurrent() {
    const outerPromise = new Promise((resolve, reject) => {
      const promise = stateSyncService.getMostRecentHistoricalState();

      promise.catch((error) => {
        console.log(error.stack);
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
