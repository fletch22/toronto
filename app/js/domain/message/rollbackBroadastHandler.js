import GenericListener from './genericListener';
import { WorkerMessageTypes } from '../../worker/workerMessage';
import { stateRollbackModalShow, showErrorModal } from '../../actions/index';

class RollbackBroadcastHandler {

  constructor(dispatch) {
    this.callback = null;
    this.dispatch = dispatch;
  }

  showRollbackModal(stateId) {
    this.dispatch(stateRollbackModalShow(stateId));
  }

  showErrorModal() {
    this.dispatch(showErrorModal());
  }

  initialize() {
    const genericListener = new GenericListener();

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

        if (typeof eventMessage.type === 'string'
        && eventMessage.type === WorkerMessageTypes.StateRollback) {
          switch (eventMessage.type) {
            case WorkerMessageTypes.StateRollback: {
              this.showRollbackModal(eventMessage.body);
              resolve();
              break;
            }
            case WorkerMessageTypes.Error: {
              this.showErrorModal();
              break;
            }
            default: {
              // Do nothing.
            }
          }

        }
      };
    });

    genericListener.register(this.callback);

    return {
      promise,
      callback: this.callback
    };
  }
}

export default RollbackBroadcastHandler;
