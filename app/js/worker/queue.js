import stateSyncService from '../service/stateSyncService';
import MessagePoster from '../domain/message/messagePoster';

export const QueueMessageTypes = {
  QUEUE_DRAINED_AND_WAITING: 'QUEUE_DRAINED_AND_WAITING',
  STATE_ROLLBACK: 'STATE_ROLLBACK'
};

class QueueMessage {
  constructor(queueMessageType, data) {
    return {
      queueMessageType: queueMessageType,
      data: data
    };
  }
}

export class QueueListener {

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

const TmpAccumulator = [];

class Queue {

  constructor() {
    this.accumulator = [];
    this.deliveryProcessingIsPaused = false;
    this.isAccumulatorProcessorPaused = false;
    this.messagePoster = new MessagePoster();
  }

  postMessage(message) {
    this.messagePoster.post(message);
  }

  emitEventRollbackState(stateArray) {
    this.postMessage(new QueueMessage(QueueMessageTypes.STATE_ROLLBACK, stateArray));
  }

  // NOTE: 03-25-2016: Really only used by tests.
  emitEventQueueEmpty() {
    this.postMessage(new QueueMessage(QueueMessageTypes.QUEUE_DRAINED_AND_WAITING));
  }

  emitEventIfQueueEmpty() {
    if (this.accumulator.length === 0) {
      this.emitEventQueueEmpty();
    }
  }

  accumulatorItemProcessing() {
    let promise;
    if (this.deliveryProcessingIsPaused) {
      setTimeout(this.accumulatorItemProcessing, 1);
      return promise;
    }

    let sendArray = null;

    // This guards against a weird behavior caused by splice; the array is momentarily 'undefined' during splicing.
    // If it undefined we wait a moment. After waiting the array goes back to not 'undefined'.
    if (typeof this.accumulator === 'undefined') {
      setTimeout(this.accumulatorItemProcessing, 1);
      return promise;
    }

    if (this.accumulator.length === 0) {
      this.emitEventIfQueueEmpty();
    } else {
      sendArray = this.accumulator.splice(0, this.accumulator.length);

      this.deliveryProcessingIsPaused = true;
      const statePackage = { states: sendArray };

      const queue = this;
      promise = new Promise((resolve, reject) => {
        stateSyncService.saveStateArray(statePackage)
          .then((response) => {
            queue.deliveryProcessingIsPaused = false;

            queue.emitEventIfQueueEmpty();
            resolve(response);
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
