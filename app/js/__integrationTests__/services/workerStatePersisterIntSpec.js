import Worker from 'worker!../../worker/statePersisterWorker.js';
import WorkerMessage, { WorkerMessageTypes } from '../../worker/workerMessage';

describe('Worker service', () => {
  const worker = new Worker();

  function getString(length) {
    return new Array(length + 1).join('x');
  }

  it('should execute save ideal messages correctly.', (done) => {

    worker.onmessage = function (event) {
      if (event.data
        && event.data.body) {
        const message = event.data.body.substr(0, 10);
        console.log(`This was an event reflection from the worker thread: ${message}`);
      }
      done();
    };

    const str = getString(1000);
    worker.postMessage(new WorkerMessage(`Test 1: ${str}`, WorkerMessageTypes.PersistMessageNoGuaranteedResponse));
    worker.postMessage(new WorkerMessage(`Test 2: ${str}`, WorkerMessageTypes.PersistMessageNoGuaranteedResponse));
    worker.postMessage(new WorkerMessage(`Test 3: ${str}`, WorkerMessageTypes.PersistMessageNoGuaranteedResponse));
    worker.postMessage(new WorkerMessage(`Test 4: ${str}`, WorkerMessageTypes.PersistMessageNoGuaranteedResponse));
    worker.postMessage(new WorkerMessage(`Test 5: ${str}`, WorkerMessageTypes.PersistMessageNoGuaranteedResponse));
    worker.postMessage(new WorkerMessage(`Test 6: ${str}`, WorkerMessageTypes.PersistMessageNoGuaranteedResponse));
    worker.postMessage(new WorkerMessage(`Test 7: ${str}`, WorkerMessageTypes.PersistMessageNoGuaranteedResponse));
    worker.postMessage(new WorkerMessage(`Test 8: ${str}`, WorkerMessageTypes.PersistMessageNoGuaranteedResponse));
    worker.postMessage(new WorkerMessage(`Test 9: ${str}`, WorkerMessageTypes.PersistMessageNoGuaranteedResponse));

  });

});
