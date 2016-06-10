import stateSyncService from '../service/stateSyncService';
import { actionSetState, actionHideTimeTravelNavBar } from '../actions';

class StateGetAndDispatch {

  constructor() {
    this.init();
  }

  init() {
    this.index = 0;
    this.currentStateClientId = null;
  }

  success(data, dispatch, indexRetrieved) {
    const promise = new Promise((resolve, reject) => {

      const state = JSON.parse(data.state);
      this.currentStateClientId = data.clientId;

      if (state !== null) {
        this.index = indexRetrieved;
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

  rollbackToCurrentState(dispatch) {
    let promise;
    if (this.currentStateClientId === null) {
      const error = { message: 'No current state client ID found.' };
      dispatch(actionHideTimeTravelNavBar());
      promise = Promise.reject(error);
    } else {
      const self = this;
      promise = stateSyncService.rollbackToStateId(this.currentStateClientId);
      promise.then(() => {
        self.init();
        dispatch(actionHideTimeTravelNavBar());
      });
    }

    return promise;
  }
}

export default new StateGetAndDispatch();
