import stateSyncService from '../service/stateSyncService';
import { actionSetState } from '../actions';
import stateRetriever from '../domain/stateRetriever';
import timeTravelTransaction from '../domain/timeTravelTransaction';

class StateGetAndDispatch {

  constructor() {
    this.index = 0;
  }

  success(data, dispatch, indexRetrieved) {
    const promise = new Promise((resolve, reject) => {

      const state = JSON.parse(data.state);

      if (state === null) {
        if (data.isEarliestState) {
          this.index = data.indexOfMaxElement + 1;

          const promiseInner = stateRetriever.deriveState();

          promiseInner.then((stateInner) => {
            timeTravelTransaction.setTransactionToRewindToBeforeEarliestState();
            dispatch(actionSetState(stateInner));
            resolve();
          });

          promiseInner.catch((error) => {
            reject(error);
          });
        } else {
          throw new Error('There was an error condition that should not be possible in stateGetAndDispatch');
        }
      } else {
        this.index = indexRetrieved;
        timeTravelTransaction.transactionId = data.transactionId;
        dispatch(actionSetState(state));
        resolve();
      }
    });
    return promise;
  }

  error(error) {
    console.log(new Error(error));
  }

  getEarlierStateAndDispatch(dispatch) {
    return this.getStateAndDispatch(dispatch, 1);
  }

  getLaterStateAndDispatch(dispatch) {
    return this.getStateAndDispatch(dispatch, -1);
  }

  getStateAndDispatch(dispatch, step) {
    let indexOfState = this.index + step;
    indexOfState = (indexOfState < 0) ? 0 : indexOfState;
    const promise = stateSyncService.getHistoricalState(indexOfState);

    promise.then((data) => {
      this.success(data, dispatch, indexOfState);
    });
    promise.catch(this.error);

    return promise;
  }
}

export default new StateGetAndDispatch();