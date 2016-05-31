import Worker from 'worker!./statePersisterWorker.js';
import WorkerMessage, { WorkerMessageTypes } from './workerMessage';
import StatePackager from '../service/statePackager';
import MessagePoster from '../domain/message/messagePoster';

class StatePersisterWorkerClient {

  constructor() {
    this.statePackager = new StatePackager();
    this.worker = new Worker();
    this.messagePoster = new MessagePoster();
    this.wireUpRebroadcaster();
  }

  wireUpRebroadcaster() {
    this.worker.addEventListener('message', (event) =>                             {
      this.messagePoster.post(event.data);
    });
  }

  persistStateNoResponse(jsonStateOld, jsonStateNew) {
    this.persistState(jsonStateOld, jsonStateNew, WorkerMessageTypes.PersistMessageNoGuaranteedResponse);
  }

  persistStateExpectResponse(jsonStateOld, jsonStateNew) {

    this.worker.addEventListener('message', (event) => {
      console.log(event);
    });

    this.persistState(jsonStateOld, jsonStateNew, WorkerMessageTypes.PersistMessageGuaranteedResponse);
  }

  persistState(jsonStateOld, jsonStateNew, workerMessageType) {
    const statePackage = this.statePackager.package(jsonStateOld, jsonStateNew);
    this.worker.postMessage(new WorkerMessage(statePackage, workerMessageType));
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

  resetPersister() {
    this.worker.postMessage(new WorkerMessage('', WorkerMessageTypes.ResetQueue));
  }

  blockadeAndDrain() {
    const message = new WorkerMessage('', WorkerMessageTypes.BlockadeAndDrain);
    this.worker.postMessage(message);

    return message.id;
  }

  unblockade() {
    const message = new WorkerMessage('', WorkerMessageTypes.Unblockade);
    this.worker.postMessage(message);
  }
}

export default new StatePersisterWorkerClient();