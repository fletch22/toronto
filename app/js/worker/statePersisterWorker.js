import { WorkerMessageTypes } from './workerMessage';
import Queue from './queue';

let hasRegisteredEventListener = false;

const StatePersisterWorker = function spw() {
  const statePersisterWorker = this;
  const queue = new Queue();

  function registerEventListener() {
    if (hasRegisteredEventListener === false) {
      addEventListener('message', (event) => {
        const message = event.data;

        switch (message.type) {
          case WorkerMessageTypes.PersistMessageNoGuaranteedResponse: {
            queue.push(message.body);
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
