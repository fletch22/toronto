import { actionSetState } from '../actions';
import statePersisterWorkerClient from '../worker/statePersisterWorkerClient';
import GenericListener from '../domain/message/genericListener';

class CrudActionCreator {

  invoke(service, successCallback) {
    return (dispatch, getState) => {
      let expectedId;

      const genericListener = new GenericListener();

      const messageProcessor = (event) => {
        if (typeof event.data !== 'string') {
          return;
        }

        const eventMessage = JSON.parse(event.data);
        if (eventMessage.id === expectedId) {
          genericListener.unregister();

          service(dispatch, getState())
            .then((response) => {
              dispatch(actionSetState(response));
              statePersisterWorkerClient.unblockade();
              if (successCallback !== undefined) {
                successCallback();
              }
              return Promise.resolve();
            })
            .catch(() => {
              statePersisterWorkerClient.unblockade();
            });
        }
      };

      genericListener.register(messageProcessor);
      expectedId = statePersisterWorkerClient.blockadeAndDrain();
    };
  }
}

export default new CrudActionCreator();
