import Worker from 'worker!../../worker/statePersisterWorker.js';
import Message, { MessageTypes } from '../../worker/message';

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
    worker.postMessage(new Message(`Test 1: ${str}`, MessageTypes.PersistMessage));
    worker.postMessage(new Message(`Test 2: ${str}`, MessageTypes.PersistMessage));
    worker.postMessage(new Message(`Test 3: ${str}`, MessageTypes.PersistMessage));
    worker.postMessage(new Message(`Test 4: ${str}`, MessageTypes.PersistMessage));
    worker.postMessage(new Message(`Test 5: ${str}`, MessageTypes.PersistMessage));
    worker.postMessage(new Message(`Test 6: ${str}`, MessageTypes.PersistMessage));
    worker.postMessage(new Message(`Test 7: ${str}`, MessageTypes.PersistMessage));
    worker.postMessage(new Message(`Test 8: ${str}`, MessageTypes.PersistMessage));
    worker.postMessage(new Message(`Test 9: ${str}`, MessageTypes.PersistMessage));

  });

});
