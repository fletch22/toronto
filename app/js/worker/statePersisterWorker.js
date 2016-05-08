import WorkerMessage from './workerMessage';
import { WorkerMessageTypes } from './workerMessage';
import Queue from './queue';

class PersistMessageService {

  constructor(queue) {
    this.queue = queue;
  }

  postMessage(message) {
    try {
      // NOTE: This is necessary so our tests don't throw. When some tests are run
      // they are run in a window context as opposed to a worker context. When in the window context
      // then this code will use window.postMessage. PostMessage function expects a second parameter and will throw if it doesn't find one.
      // If we are in the worker context the second (unneeded) parameter will be ignored.
      const domain = (typeof window !== 'undefined') ? location.href : undefined;
      postMessage(message, domain);
    } catch (err) {
      console.error(err, err.stack);
    }
  }

  persist(message) {
    // Stop accumulator processing

    //

    const promise = this.queue.push(message);

    promise.then(() => {
      console.log('Not implemented yet. Will be part of guaranteed response code.');
    });
  }
}

let hasRegisteredEventListener = false;

const StatePersisterWorker = function spw() {
  const statePersisterWorker = this;
  const queue = new Queue();
  const persistMessageService = new PersistMessageService(queue);

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
            persistMessageService.persist(message.body, message.id);
            break;
          }
          case WorkerMessageTypes.PauseQueue: {
            queue.isAccumulatorProcessorPaused = true;
            break;
          }
          case WorkerMessageTypes.UnpauseQueue: {
            queue.isAccumulatorProcessorPaused = false;
            break;
          }
          case WorkerMessageTypes.PauseAndClear: {
            queue.isAccumulatorProcessorPaused = true;
            queue.eliminateItemsWithoutProcessing();
            break;
          }
          case WorkerMessageTypes.PauseAndDrain: {
            queue.isAccumulatorProcessorPaused = true;
            queue.pauseAndProcessExisting();
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
