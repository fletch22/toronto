import stateSyncService from '../service/stateSyncService';
import { actionSetState, actionHideTimeTravelNavBar } from '../actions';

class StateGetAndDispatch {

  constructor() {
    this.init();
  }

  init() {
    this.index = 1;
    this.currentStateClientId = null;
  }

  successHandler(data, dispatch) {
    const promise = new Promise((resolve) => {
      const state = JSON.parse(data.state);
      if (state !== null) {
        this.currentStateClientId = data.clientId;
        this.index = data.indexOfReturnedState;
        dispatch(actionSetState(state));
        resolve();
      }
    });
    return promise;
  }

  errorHandler(error) {
    throw new Error(error.stack);
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
      return this.successHandler(data, dispatch);
    });
    promise.catch((err) => {
      this.errorHandler(err);
    });

    return promise;
  }

  getFirstState(dispatch) {
    const promise = stateSyncService.getEarliestState();

    promise.then((data) => {
      this.successHandler(data, dispatch);
    });
    promise.catch(this.errorHandler);

    return promise;
  }

  getMostRecentState(dispatch) {
    const promise = stateSyncService.getMostRecentHistoricalState();

    promise.then((data) => {
      this.successHandler(data, dispatch);
    });
    promise.catch(this.errorHandler);

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
