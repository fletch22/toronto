import { actionSetState } from '../actions';
import statePersisterWorkerClient from '../worker/statePersisterWorkerClient';
import GenericListener from '../domain/message/genericListener';

class CrudActionCreator {

  invoke(service, successCallback) {

    console.log('About to return invoked function.');
    return (dispatch, getState) => {
      console.log('return function finally invoked.');
      let expectedId;

      const genericListener = new GenericListener();

      const messageProcessor = (event) => {
        try {
          if (typeof event.data !== 'string') {
            return;
          }

          const eventMessage = JSON.parse(event.data);
          if (eventMessage.id === expectedId) {
            genericListener.unregister();



            service(dispatch, getState())
              .then((response) => {

                console.log('About to invoke service.');
                throw new Error('This is an error.');

                dispatch(actionSetState(response));
                statePersisterWorkerClient.unblockade();
                if (successCallback) {
                  successCallback();
                }
                return Promise.resolve();
              })
              .catch(() => {
                statePersisterWorkerClient.unblockade();
              });
          }
        } catch (error) {
          console.log('Got errrrr.');
          // modalDispatch.dispatchErrorModal(error, 'Encountered error while trying to add website.', dispatch);
        }
      };

      genericListener.register(messageProcessor);

      console.log('About to blockade and drain.');
      expectedId = statePersisterWorkerClient.blockadeAndDrain();
    };
  }
}

export default new CrudActionCreator();
