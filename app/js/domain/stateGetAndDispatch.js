import stateSyncService from '../service/stateSyncService';
import { setState } from '../actions';
import stateRetriever from '../domain/stateRetriever';

class StateGetAndDispatch {

  constructor() {
    this.index = 0;
  }

  success(data, dispatch, indexRetrieved) {

    const state = JSON.parse(data.state);
    console.log(indexRetrieved + '- ' + data.isEarliestState);

    if (state === null) {
      if (data.isEarliestState) {
        const promise = new Promise((resolve, reject) => {
          stateRetriever.deriveState(resolve, reject);
        });
        promise.then((state) => {
          dispatch(setState(state));
          this.index = indexRetrieved;
        });
      }
    } else {
      dispatch(setState(state));
      this.index = indexRetrieved;
    }
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