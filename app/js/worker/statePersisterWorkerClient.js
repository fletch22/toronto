import Worker from 'worker!./statePersisterWorker.js';
import Message, { MessageTypes } from './message';
import deepDiff from 'deep-diff';
import StatePackager from '../service/statePackager';

class StatePersisterWorkerClient {

  constructor() {
    this.statePackager = new StatePackager();
    this.worker = new Worker();

    this.worker.onmessage = function (event) {
      if (event.data
        && event.data.body) {
        const message = event.data.body.substr(0, 10);
        console.log(`This was an event reflection from the worker thread: ${message}`);
      }
    };
  }

  persistState(jsonStateOld, jsonStateNew) {
    const package2 = this.statePackager.package(jsonStateOld, jsonStateNew);

    this.worker.postMessage(new Message(package2, MessageTypes.PersistMessage));
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