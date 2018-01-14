import ModelToStateGenerator from '../stores/ModelToStateGenerator';
import RestService from '../service/restService';
import stateSyncService from '../service/stateSyncService';
import defaultState from '../state/defaultState';
import deepDiff from 'deep-diff';
import util from '../util/util';

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
        c.l('Got error calling getAppContainer.');
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
        const stateRecent = data.state;

        // NOTE: 10-17-2017: fleschec: This is for development only. In production this is unnecessary and might even be slow.
        // if (!!stateRecent) {
        //   const stateHashCode = util.hashCode(data.state);
        //   c.l(`Java state: ${stateHashCode} ...`);
        //
        //   this.deriveState().then((derivedState) => {
        //     const diff = deepDiff(derivedState.model, stateRecent.model);
        //     if (diff) {
        //       c.lo(derivedState.model, 'derivedState.model :');
        //       c.lo(diff, 'diff: ');
        //       throw new Error('Encountered error when comparing derived state with rush state. Your logic is incorrect.');
        //     }
        //   });
        // }

        // if (stateRecent === null) {
        //   this.deriveState().then((stateInner) => {
        //     stateSyncService.saveSessionToNode(stateInner.serverStartupTimestamp);
        //     resolve(stateInner);
        //   }).catch((error) => {
        //     reject(error);
        //   });
        // } else {
        //   c.l(stateRecent.serverStartupTimestamp, 'state.serverStartupTimestamp: ');

        // c.l(stateRecent.serverStartupTimestamp);

        // const startupTimestamp = data.startupTimestamp;
        // if (stateRecent.serverStartupTimestamp !== startupTimestamp) {
        //   console.info('It appears that the server timestamp and the state timestamp are out of sync. This can happen if the state has been restored from backup.' +
        //     'To fix this, the system will set the current startup timestamp to the server timestamp.');
        //   stateRecent.serverStartupTimestamp = startupTimestamp;
        // }

        resolve(stateRecent);
        // }
      });
    });

    return outerPromise;
  }
}

export default new StateRetriever();
