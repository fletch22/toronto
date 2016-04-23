import Worker from 'worker!./statePersisterWorker.js';
import Message, { MessageTypes } from './message';
import deepDiff from 'deep-diff';

class StatePersisterWorkerClient {

  constructor() {
    this.worker = new Worker();

    this.worker.onmessage = function (event) {
      if (event.data
        && event.data.body) {
        const message = event.data.body.substr(0, 10);
        console.log(`This was an event reflection from the worker thread: ${message}`);
      }
    };
  }

  persistState(stateOld, stateNew) {

    const difference = deepDiff(stateOld, stateNew);

    const payload = {
      state: JSON.stringify(stateNew),
      diffBetweenOldAndNew: JSON.stringify(difference)
    };

    this.worker.postMessage(new Message(payload, MessageTypes.PersistMessage));
  }

  pauseAndFlush() {
    this.worker.postMessage(new Message('', MessageTypes.PauseAndFlush));
  }

  pausePersister() {
    this.worker.postMessage(new Message('', MessageTypes.PauseQueue));
  }

  unpausePersister() {
    this.worker.postMessage(new Message('', MessageTypes.UnpauseQueue));
  }
}

export default new StatePersisterWorkerClient();