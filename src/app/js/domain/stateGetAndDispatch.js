import stateSyncService from '../service/stateSyncService';
import { actionSetState, actionHideTimeTravelNavBar } from '../actions';

class StateGetAndDispatch {

  constructor() {
    this.init();
  }

  init() {
    // NOTE: 08-06-2017: Index must be 1. Without it a major bug appears during rewind.
    this.index = 0;
    this.currentStateClientId = null;
  }

  successHandler(data, dispatch) {
    const promise = new Promise((resolve) => {
      const state = data.state;
      c.l(`IoRS: ${data.indexOfReturnedState}`);
      c.l(`CID: ${data.clientId}`);
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
    c.l('Getting most recent state...');
    const promise = stateSyncService.getMostRecentHistoricalState();

    promise.then((data) => {
      this.successHandler(data, dispatch);
    });
    promise.catch(this.errorHandler);

    return promise;
  }

  rollbackToCurrentState(dispatch, state) {
    let promise;
    if (this.currentStateClientId === null) {
      const error = { message: 'No current state client ID found.' };
      dispatch(actionHideTimeTravelNavBar());
      promise = Promise.reject(error);
    } else {
      const self = this;
      promise = stateSyncService.rollbackToStateId(this.currentStateClientId, state);
      promise.then(() => {
        self.init();
        dispatch(actionHideTimeTravelNavBar());
      });
    }

    return promise;
  }
}

export default new StateGetAndDispatch();
