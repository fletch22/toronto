import GenericListener from './genericListener';

class RollbackBroadcastHandler {

  initialize() {
    const genericListener = new GenericListener();

    const callback = (event) => {
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
      && eventMessage.type === 'sdfafsdaasfdfdsafadsfds') {
        // Show rollback warning modal
        console.log('Should show warning modal.');
      }
    };

    genericListener.register(callback);
  }
}

export default RollbackBroadcastHandler;
