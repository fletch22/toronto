import stateSyncService from '../service/stateSyncService';
import { setState } from '../actions';
import stateRetriever from '../domain/stateRetriever';

class StateGetAndDispatch {

  constructor() {
    this.TransactionSignifier = {
      TRANSACTION_ID_UNSET: -1,
      TRANSACTION_ID_BEFORE_FIRST_TRANSACTION: -2
    }
    this.index = 0;
    this.transactionId = this.TransactionSignifier.TRANSACTION_ID_UNSET;
  }

  success(data, dispatch, indexRetrieved) {
    const promise = new Promise((resolve, reject) => {

      const state = JSON.parse(data.state);

      if (state === null) {
        if (data.isEarliestState) {
          this.index = data.indexOfMaxElement + 1;
          const promiseInner = stateRetriever.deriveState();

          promiseInner.then((stateInner) => {

            this.transactionId = this.TransactionSignifier.TRANSACTION_ID_BEFORE_FIRST_TRANSACTION;
            dispatch(setState(stateInner));
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
        this.transactionId = data.transactionId;
        dispatch(setState(state));
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