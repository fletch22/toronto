import { actionSetState, actionShowErrorModal, actionHideCurrentModal } from '../actions';
import statePersisterWorkerClient from '../worker/statePersisterWorkerClient';
import GenericListener from '../domain/message/genericListener';
import ServerErrorTransformer from '../service/serverErrorTransformer';

class CrudActionCreator {

  invoke(service, errorMessage) {
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
