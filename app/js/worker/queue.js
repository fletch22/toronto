import stateSyncService from '../service/stateSyncService';

class Queue {

  constructor() {
    this.accumulator = [];
    this.deliveryProcessingIsPaused = false;
    this.isAccumulatorProcessorPaused = false;
  }

  accumulatorItemProcessing() {
    let promise;
    if (this.deliveryProcessingIsPaused) {
      setTimeout(this.accumulatorItemProcessing, 1);
      return promise;
    }

    let sendArray = null;
    if (this.accumulator.length > 0) {
      sendArray = this.accumulator.splice(0, this.accumulator.length);

      this.deliveryProcessingIsPaused = true;
      const statePackage = { states: sendArray };

      const queue = this;
      promise = new Promise((resolve, reject) => {
        stateSyncService.saveStateArray(statePackage)
          .then((response) => {
            queue.deliveryProcessingIsPaused = false;
            resolve(response);
          })
          .catch((error) => {
            const previous100States = stateSyncService.rollbackAndFetchStateHistory(100);
            reject(error);
          });
      });
    }
    return promise;
  }

  getQueueArrayIsPaused() {
    return this.deliveryProcessingIsPaused;
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
