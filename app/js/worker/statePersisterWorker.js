import { MessageTypes } from './message';
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
          case MessageTypes.PersistMessage: {
            queue.push(message.body);
            break;
          }
          case MessageTypes.PauseQueue: {
            queue.isAccumulatorProcessorPaused = true;
            break;
          }
          case MessageTypes.UnpauseQueue: {
            queue.isAccumulatorProcessorPaused = false;
            break;
          }
          case MessageTypes.PauseAndClear: {
            queue.isAccumulatorProcessorPaused = true;
            queue.eliminateItemsWithoutProcessing();
            break;
          }
          case MessageTypes.PauseAndDrain: {
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
