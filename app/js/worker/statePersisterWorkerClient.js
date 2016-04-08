import Worker from 'worker!./statePersisterWorker.js';
import Message, { MessageTypes } from './message';

class StatePersisterWorkerClient {

  constructor() {
    console.log('Is this persisted?');
    this.worker = new Worker();

    this.worker.onmessage = function (event) {
      if (event.data
        && event.data.body) {
        const message = event.data.body.substr(0, 10);
        console.log(`This was an event reflection from the worker thread: ${message}`);
      }
    };
  }

  persistState(state) {
    const json = JSON.stringify(state);
    console.log(`persisting ${json}`);
    this.worker.postMessage(new Message(json, MessageTypes.PersistMessage));
  }
}

export default new StatePersisterWorkerClient();