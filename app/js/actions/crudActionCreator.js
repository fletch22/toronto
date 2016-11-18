import { actionSetState } from '../actions';
import statePersisterWorkerClient from '../worker/statePersisterWorkerClient';
import GenericListener from '../domain/message/genericListener';

class CrudActionCreator {

  invoke(service, errorMessage) {

    console.log('About to return invoked function.');

    return (dispatch, getState) => {
      console.log('return function finally invoked.');
      let expectedId;

      const genericListener = new GenericListener();

      const messageProcessor = (event) => {
        if (typeof event.data !== 'string') {
          return;
        }

        const eventMessage = JSON.parse(event.data);
        if (eventMessage.id === expectedId) {
          genericListener.unregister();

          console.log('About to invoke service.');

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

      console.log('About to blockade and drain.');
      expectedId = statePersisterWorkerClient.blockadeAndDrain();
    };
  }
}

export default new CrudActionCreator();
