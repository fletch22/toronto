import GenericListener from './genericListener';
import { WorkerMessageTypes } from '../../worker/workerMessage';
import { actionShowStateRollbackModal, actionShowErrorModal, actionHideCurrentModal } from '../../actions/index';

class RollbackBroadcastHandler {

  constructor(dispatch) {
    this.callback = null;
    this.dispatch = dispatch;
    this.genericListener = new GenericListener();
  }

  showRollbackModal(rollbackPayload) {
    console.debug(`Rollback payload type: ${typeof rollbackPayload}`);
    console.debug(`Will rollback to ${rollbackPayload.clientId}`);

    this.dispatch(actionShowStateRollbackModal(rollbackPayload));
  }

  showErrorModal(errorObject) {
    const okAction = actionHideCurrentModal();
    this.dispatch(actionShowErrorModal('An Error in the Worker Thread Was Detected', errorObject.stack, okAction));
  }

  initialize() {
    const rollbackBroadcastHandler = this;
    const promise = new Promise((resolve) => {
      rollbackBroadcastHandler.callback = (event) => {
        if (typeof event.data !== 'string') {
          return;
        }

        let eventMessage = null;

        try {
          eventMessage = JSON.parse(event.data);
        } catch (error) {
          return;
        }

        if (typeof eventMessage.type === 'string') {
          switch (eventMessage.type) {
            case WorkerMessageTypes.StateRollback: {
              this.showRollbackModal(eventMessage.body);
              resolve();
              break;
            }
            case WorkerMessageTypes.Error: {
              this.showErrorModal(eventMessage.body);
              resolve();
              break;
            }
            default: {
              // Do nothing.
            }
          }
        }
      };
    });

    this.genericListener.register(this.callback);

    return {
      promise,
      callback: this.callback
    };
  }
}

export default RollbackBroadcastHandler;
