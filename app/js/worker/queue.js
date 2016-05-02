import stateSyncService from '../service/stateSyncService';

const Queue = function q() {
  const queue = this;
  let queueArray = [];

  function postMessageSafe(message) {
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

  queue.emitEventRollbackState = (stateArray) => {
    postMessageSafe(stateArray);
  };

  // NOTE: 03-25-2016: Really only used by tests.
  function emitEventQueueEmpty() {
    postMessageSafe('Done.');
  }

  function emitEventIfQueueEmpty() {
    if (queueArray.length === 0) {
      emitEventQueueEmpty();
    }
  }

  function processQueue() {
    let promise;
    if (queueArray.isPaused) {
      setTimeout(processQueue, 1);
      return promise;
    }

    let sendArray = null;
    if (queueArray.length === 0) {
      emitEventIfQueueEmpty();
    } else {
      sendArray = queueArray.splice(0, queueArray.length);

      queueArray.isPaused = true;
      const statePackage = { states: sendArray };

      promise = new Promise((resolve, reject) => {
        stateSyncService.saveStateArray(statePackage)
          .then((response) => {
            queueArray.isPaused = false;

            resolve(response);
            emitEventIfQueueEmpty();
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

  queue.isPaused = false;
  queue.push = function push(data) {
    queueArray.push(data);

    if (!queue.isPaused) {
      return processQueue();
    } else {
      return Promise.resolve();
    }
  };

  queue.flush = function() {
    queueArray = [];
  };
};

export default Queue;
