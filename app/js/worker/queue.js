import stateSyncService from '../service/stateSyncService';

class Queue {

  constructor() {
    this.accumulator = [];
    this.queueArrayIsPaused = false;
    this.isAccumulatorProcessorPaused = false;
  }

  postMessageSafe(message) {
    try {
      // NOTE: This if-wrapper is necessary so our tests don't throw. When some tests are run
      // they are run in a window context as opposed to a worker context. When in the window context
      // then window.postMessage. PostMessage function expects a second parameter and will throw if it doesn't find one.
      if (typeof window === 'undefined') {
        postMessage(message);
      }
    } catch (err) {
      console.error(err, err.stack);
    }
  }

  emitEventRollbackState(stateArray){
    this.postMessageSafe(stateArray);
  }

  // NOTE: 03-25-2016: Really only used by tests.
  emitEventQueueEmpty() {
    this.postMessageSafe('Done.');
  }

  emitEventIfQueueEmpty() {
    if (this.accumulator.length === 0) {
      this.emitEventQueueEmpty();
    }
  }

  accumulatorItemProcessing() {
    let promise;
    if (this.queueArrayIsPaused) {
      setTimeout(this.accumulatorItemProcessing, 1);
      return promise;
    }

    let sendArray = null;
    if (this.accumulator.length === 0) {
      this.emitEventIfQueueEmpty();
    } else {
      sendArray = this.accumulator.splice(0, this.accumulator.length);

      this.queueArrayIsPaused = true;
      const statePackage = { states: sendArray };

      const queue = this;
      promise = new Promise((resolve, reject) => {
        stateSyncService.saveStateArray(statePackage)
          .then((response) => {
            queue.queueArrayIsPaused = false;

            resolve(response);
            queue.emitEventIfQueueEmpty();
          })
          .catch((error) => {
            const previous100States = stateSyncService.rollbackAndFetchStateHistory(100);
            queue.emitEventRollbackState(previous100States);
            reject(error);
          });
      });
    }
    return promise;
  }

  getQueueArrayIsPaused() {
    return this.queueArrayIsPaused;
  }

  push(data) {
    this.accumulator.push(data);

    if (!this.isAccumulatorProcessorPaused) {
      return this.accumulatorItemProcessing();
    } else {
      return Promise.resolve();
    }
  }

  eliminateItemsWithoutProcessing() {
    this.accumulator = [];
  }

  pauseAndProcessExisting() {
    this.isAccumulatorProcessorPaused = true;
    this.accumulatorItemProcessing();
  }

  getAccumulator() {
    return this.accumulator;
  }

  getIsPaused() {
    return this.isAccumulatorProcessorPaused;
  }

  setIsAccumulatorPaused(isPaused) {
    this.isAccumulatorProcessorPaused = isPaused;
  }
}

export default Queue;
