import ModelToStateTransformer from '../stores/modelToStateTransformer';
import RestService from '../service/restService';
import stateSyncService from '../service/stateSyncService';

class StateRetriever {

  deriveState() {
    return RestService.getAppContainer()
      .then((responseData) => {
        return new ModelToStateTransformer().transform(responseData);
      });
  }

  getCurrent() {
    const outerPromise = new Promise((resolve, reject) => {
      const promise = stateSyncService.getHistoricalState(0);

      promise.catch((error) => {
        console.log(error.stack);
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
}

export default new StateRetriever();