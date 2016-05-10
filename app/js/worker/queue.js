import stateSyncService from '../service/stateSyncService';
import MessagePoster from '../domain/message/messagePoster';
import uuid from 'node-uuid';

export const QueueMessageTypes = {
  QUEUE_EMPTY: 'QUEUE_EMPTY',
  QUEUE_DRAINED_AND_WAITING: 'QUEUE_DRAINED_AND_WAITING',
  STATE_ROLLBACK: 'STATE_ROLLBACK'
};

class QueueMessage {
  constructor(queueMessageType, data, id) {
    return {
      id: (id === 'undefined') ? uuid.v1() : id,
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

class Queue {

  constructor() {
    this.accumulator = [];
    this.deliveryProcessingIsPaused = false;
    this.blockadeIncoming = false;
    this.isAccumulatorProcessorPaused = false;
    this.messagePoster = new MessagePoster();
    this.sendArray = [];
  }

  postMessage(messageObject) {
    this.messagePoster.post(JSON.stringify(messageObject));
  }

  emitEventRollbackState(stateArray) {
    this.postMessage(new QueueMessage(QueueMessageTypes.STATE_ROLLBACK, stateArray));
  }

  // NOTE: 03-25-2016: Really only used by tests.
  emitEventQueueEmpty(id) {
    this.postMessage(new QueueMessage(QueueMessageTypes.QUEUE_EMPTY, null, id));
  }

  emitEventIfQueueEmpty() {
    if (this.accumulator.length === 0) {
      this.emitEventQueueEmpty();
    }
  }

  waitUntilQueueEmpty() {
    const queue = this;
    return new Promise((resolve) => {
      function checkQueue() {
        if (queue.accumulator.length === 0) {
          resolve();
        } else {
          setTimeout(checkQueue, 10);
        }
      }
      checkQueue();
    });
  }

  areAllQueuesFlushedAndEmpty() {
    return typeof this.accumulator !== 'undefined' && this.accumulator.length === 0 && this.sendArray.length === 0;
  }

  blockadeAndDrain(id) {
    // Note: This is a work in progress. The system needs to block all incoming states
    // and raise an error if one arrives during this blockade.
    this.blockadeIncoming = true;
    const queue = this;

    function checkQueue() {
      if (queue.areAllQueuesFlushedAndEmpty()) {
        queue.emitEventQueueEmpty(id);
      } else {
        setTimeout(checkQueue, 1);
      }
    }

    this.accumulatorItemProcessing();

    checkQueue();
  }

  unblockade() {
    this.blockadeIncoming = false;
  }

  accumulatorItemProcessing() {
    let promise;
    if (this.deliveryProcessingIsPaused) {
      setTimeout(this.accumulatorItemProcessing, 1);
      return promise;
    }

    // This guards against a weird behavior caused by splice; the array is momentarily 'undefined' during splicing.
    // If it undefined we wait a moment. After waiting the array goes back to not 'undefined'.
    if (typeof this.accumulator === 'undefined') {
      setTimeout(this.accumulatorItemProcessing, 1);
      return promise;
    }

    if (this.accumulator.length === 0) {
      this.emitEventIfQueueEmpty();
    } else {
      this.sendArray = this.accumulator.splice(0, this.accumulator.length);

      this.deliveryProcessingIsPaused = true;
      const stateArrayPackage = { states: this.sendArray };

      const queue = this;
      promise = new Promise((resolve, reject) => {
        stateSyncService.saveStateArray(stateArrayPackage)
          .then((response) => {
            this.sendArray = [];
            queue.deliveryProcessingIsPaused = false;
            queue.emitEventIfQueueEmpty();
            resolve(response);
          })
          .catch((error) => {
            this.sendArray = [];
            queue.deliveryProcessingIsPaused = false;
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
    if (!this.blockadeIncoming) {
      this.accumulator.push(data);

      if (!this.isAccumulatorProcessorPaused) {
        return this.accumulatorItemProcessing();
      }
    }
    return Promise.resolve();
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
