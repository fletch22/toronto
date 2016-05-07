import Worker from 'worker!./statePersisterWorker.js';
import WorkerMessage, { WorkerMessageTypes } from './workerMessage';
import deepDiff from 'deep-diff';
import StatePackager from '../service/statePackager';

export class StatePersistWorkerListener {

  constructor() {
    this.TYPE = 'message';
    this.listener = null;
  }

  register(callback) {
    this.listener = window.addEventListener(this.TYPE, callback, false);
  }

  unregister() {
    window.removeEventListener(this.TYPE, this.listener, false);
  }
}

class StatePersisterWorkerClient {

  constructor() {
    this.statePackager = new StatePackager();
    this.worker = new Worker();
  }

  persistState(jsonStateOld, jsonStateNew) {
    const statePackage = this.statePackager.package(jsonStateOld, jsonStateNew);

    this.worker.postMessage(new WorkerMessage(statePackage, WorkerMessageTypes.PersistMessage));
  }

  pauseAndFlush() {
    this.worker.postMessage(new WorkerMessage('', WorkerMessageTypes.PauseAndClear));
  }

  pausePersister() {
    this.worker.postMessage(new WorkerMessage('', WorkerMessageTypes.PauseQueue));
  }

  unpausePersister() {
    this.worker.postMessage(new WorkerMessage('', WorkerMessageTypes.UnpauseQueue));
  }
}

export default new StatePersisterWorkerClient();