import ModelToStateTransformer from '../stores/modelToStateTransformer';
import RestService from '../service/restService';
import stateSyncService from '../service/stateSyncService';

class StateRetriever {

  deriveState(resolve, reject) {
    RestService.getAppContainer()
      .then((responseData) => {
        const state = ModelToStateTransformer.transform(responseData);
        resolve(state);
      })
      .catch((error) => {
        reject(error);
      });
  }

  deriveStateNew() {
    return RestService.getAppContainer()
      .then((responseData) => {
        return ModelToStateTransformer.transform(responseData);
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
        console.log(JSON.stringify(state));

        if (state === null) {
          console.log('No state found.');
          this.deriveState(resolve, reject);
        } else {
          resolve(state);
        }
      });
    });

    return outerPromise;
  }
}

export default new StateRetriever();