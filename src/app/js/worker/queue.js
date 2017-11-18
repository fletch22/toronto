import stateSyncService from '../service/stateSyncService';
import MessagePoster from '../domain/message/messagePoster';
import { WorkerMessageTypes } from '../worker/workerMessage';
import WorkerMessage from '../worker/workerMessage';
import SentStateAuditTrail from './sentStateAuditTrail';
import ServerErrorTransformer from '../service/serverErrorTransformer';
import c from '../../../util/c';

class Queue {
  constructor() {
    this.postMessage = this.postMessage.bind(this);
    this.emitEventRollbackState = this.emitEventRollbackState.bind(this);
    this.emitEventError = this.emitEventError.bind(this);
    this.emitEventQueueEmpty = this.emitEventQueueEmpty.bind(this);
    this.emitEventIfQueueEmpty = this.emitEventIfQueueEmpty.bind(this);
    this.waitUntilQueueEmpty = this.waitUntilQueueEmpty.bind(this);
    this.areAllQueuesFlushedAndEmpty = this.areAllQueuesFlushedAndEmpty.bind(this);
    this.blockadeAndDrain = this.blockadeAndDrain.bind(this);
    this.blockadeAndObliterate = this.blockadeAndObliterate.bind(this);
    this.unblockade = this.unblockade.bind(this);
    this.accumulatorItemProcessing = this.accumulatorItemProcessing.bind(this);
    this.collectForAudit = this.collectForAudit.bind(this);
    this.gatherFromAuditLog = this.gatherFromAuditLog.bind(this);
    this.getQueueArrayIsPaused = this.getQueueArrayIsPaused.bind(this);
    this.push = this.push.bind(this);
    this.getAccumulator = this.getAccumulator.bind(this);
    this.getIsPaused = this.getIsPaused.bind(this);
    this.setIsAccumulatorPaused = this.setIsAccumulatorPaused.bind(this);
    this.reset();
  }

  reset() {
    this.accumulator = [];
    this.deliveryProcessingIsPaused = false;
    this.blockadeIncoming = false;
    this.isAccumulatorProcessorPaused = false;
    this.messagePoster = new MessagePoster();
    this.sendArray = [];
    this.sentStateAuditTrail = new SentStateAuditTrail();
  }

  postMessage(messageObject) {
    this.messagePoster.post(JSON.stringify(messageObject));
  }

  emitEventRollbackState(clientId, state) {
    const payload = {
      clientId,
      state
    };
    this.postMessage(new WorkerMessage(payload, WorkerMessageTypes.StateRollback));
  }

  emitEventError(error) {
    this.postMessage(new WorkerMessage(error, WorkerMessageTypes.Error));
  }

  // NOTE: 03-25-2016: Really only used by tests.
  emitEventQueueEmpty(id) {
    this.postMessage(new WorkerMessage(null, WorkerMessageTypes.QueueEmpty, id));
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

  blockadeAndObliterate() {
    // Note: This is a work in progress. The system needs to block all incoming states
    // and raise an error if one arrives during this blockade.
    this.sendArray = [];
    this.accumulator = [];
    this.blockadeIncoming = true;
    this.deliveryProcessingIsPaused = true;
    this.isAccumulatorProcessorPaused = true;
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

    if (this.accumulator.length === 0) {
      this.emitEventIfQueueEmpty();
    } else {
      this.sendArray = this.accumulator.splice(0, this.accumulator.length);

      // Note: This will help us recover from an exception.
      this.collectForAudit(this.sendArray);

      this.deliveryProcessingIsPaused = true;
      const stateArrayPackage = { states: this.sendArray };

      const queue = this;
      promise = new Promise((resolve, reject) => {
        stateSyncService.saveStateArray(stateArrayPackage)
          .then((response) => {
            this.sendArray = [];
            queue.deliveryProcessingIsPaused = false;
            queue.emitEventIfQueueEmpty();

            stateSyncService.saveStateArrayToNode(stateArrayPackage).then((nodeResponse) => {
              c.l(nodeResponse);
            });

            resolve(response);
          })
          .catch((error) => {
            queue.blockadeAndObliterate();

            // Note this is complex, but there exists scenarios of defaultState saves unintentionally submitting and saving
            // after a failed defaultState. To mitigate this risk we send a log to the server. The log is exhaustive (100+ items at least) so we are somewhat sure
            // the server can tell us the last known good save defaultState.
            stateSyncService.determineLastGoodState(this.gatherFromAuditLog())
              .then((result) => {
                queue.emitEventRollbackState(result.clientId, JSON.parse(result.stateJson));
              })
              .catch((errorInner) => {
                const errorObject = ServerErrorTransformer.transform(errorInner);

                queue.emitEventError(errorObject);
              });

            reject(error);
          });
      });
    }
    return promise;
  }

  collectForAudit(sendArray) {
    this.sentStateAuditTrail.collect(sendArray);
  }

  gatherFromAuditLog() {
    return this.sentStateAuditTrail.gatherRecent();
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

