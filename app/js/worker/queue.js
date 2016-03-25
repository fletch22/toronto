const Queue = function q() {
  const queue = this;
  const queueArray = [];

  function emitEventIfQueueEmpty() {
    if (queueArray.length === 0) {
      try {
        // NOTE: This if-wrapper is necessary so our tests don't throw. When some tests are run
        // they are run in a window context  as opposed to a worker context.
        if (typeof window === 'undefined') {
          postMessage('Done.');
        }
      } catch (err) {
        console.error(err, err.stack);
      }
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
        fetch('http://localhost:8080/vancouver/api/ping', {
          method: 'post',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(statePackage)
        })
          .then((response) => {
            if (response.status >= 400) {
              throw response;
            }
            queueArray.isPaused = false;

            resolve(response);
            emitEventIfQueueEmpty();
          })
          .catch((error) => {
            console.log(JSON.stringify(statePackage));
            // Resolution.

            // Query the database to see what the most recent state is.

            // Discard all local states in queue that are older.

            // splice the sendArray back into
            reject(error);
          });
      });
    }

    return promise;
  }

  queue.isPaused = false;
  queue.push = function push(data) {
    queueArray.push(data);
    return processQueue();
  };
};

export default Queue;
