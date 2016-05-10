import WorkerMessage from './workerMessage';
import { WorkerMessageTypes } from './workerMessage';
import Queue from './queue';
import stateSyncService from '../service/stateSyncService';
import MessagePoster from '../domain/message/messagePoster';
import { QueueListener } from '../worker/queue';

//class PersistMessageGuaranteedResponseService {
//
//  constructor(queue) {
//    this.queue = queue;
//    this.messagePoster = new MessagePoster();
//  }
//
//  emitResponseCompleteMessage(id, response) {
//    const message = new WorkerMessage({ id: id, response: response }, WorkerMessageTypes.PersistMessageResponseSuccess);
//    this.messagePoster.post(JSON.stringify(message));
//  }
//
//  emitResponseFailedMessage(id, response) {
//    const message = new WorkerMessage({ id: id, response: response }, WorkerMessageTypes.PersistMessageResponseFailure);
//    this.messagePoster.post(JSON.stringify(message));
//  }
//
//  persist(message, id) {
//    console.log('Got PersistMessageGuaranteedResponse');
//    const promise = this.queue.waitUntilQueueEmpty();
//    promise.then(() => {
//      console.log("About to caLL SAVE state.");
//      stateSyncService.saveState(message)
//        .then((response) => {
//          this.emitResponseCompleteMessage(id, JSON.parse(response));
//        })
//        .catch((error) => {
//          console.log('About to emit failed response.');
//          this.emitResponseFailedMessage(id, { error: error.message });
//        });
//    });
//  }
//}

let hasRegisteredEventListener = false;

const StatePersisterWorker = function spw() {
  const statePersisterWorker = this;
  const queue = new Queue();
  //const persistMessageGuaranteedResponseService = new PersistMessageGuaranteedResponseService(queue);

  function registerEventListener() {
    if (hasRegisteredEventListener === false) {
      addEventListener('message', (event) => {
        const message = event.data;

        console.log(event.data);

        switch (message.type) {
          case WorkerMessageTypes.PersistMessageNoGuaranteedResponse: {
            queue.push(message.body);
            break;
          }
          case WorkerMessageTypes.PersistMessageGuaranteedResponse: {
            throw new Error('not implemented');
            // persistMessageGuaranteedResponseService.persist(message.body, message.id);
            // break;
          }
          case WorkerMessageTypes.PauseQueue: {
            queue.isAccumulatorProcessorPaused = true;
            break;
          }
          case WorkerMessageTypes.UnpauseQueue: {
            queue.isAccumulatorProcessorPaused = false;
            break;
          }
          case WorkerMessageTypes.BlockadeAndDrain: {
            queue.blockadeAndDrain(message.id);
            break;
          }
          case WorkerMessageTypes.PauseAndClear: {
            queue.isAccumulatorProcessorPaused = true;
            queue.eliminateItemsWithoutProcessing();
            break;
          }
          case WorkerMessageTypes.Unblockade: {
            queue.unblockade();
            break;
          }
          default: {
            const error = new Error(`Could not determine type of worker message from type '${message.type}'`);
            throw error;
          }
        }
      }, false);
    }
    hasRegisteredEventListener = true;
  }

  statePersisterWorker.push = (data) => {
    queue.push(data);
  };

  registerEventListener();
};

/* eslint no-new: 0 */
new StatePersisterWorker();

export default StatePersisterWorker;
