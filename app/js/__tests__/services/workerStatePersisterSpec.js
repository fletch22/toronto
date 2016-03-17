import { expect } from 'chai';
import Worker from 'worker!../../worker/statePersisterWorker.js';
import Message, { MessageTypes } from '../../worker/message';

describe('Worker service', () => {
  const worker = new Worker();

  worker.onmessage = function (event) {
    console.log(`This was an event reflection from the worker thread: ${JSON.stringify(event.data)}`);
  };

  it('should execute fetch correctly.', (done) => {

    worker.postMessage(new Message('Test 1', MessageTypes.PersistMessage));
    worker.postMessage(new Message('Test 2', MessageTypes.PersistMessage));
    worker.postMessage(new Message('Test 3', MessageTypes.PersistMessage));
    worker.postMessage(new Message('Test 4', MessageTypes.PersistMessage));
    worker.postMessage(new Message('Test 5', MessageTypes.PersistMessage));
    worker.postMessage(new Message('Test 6', MessageTypes.PersistMessage));
    worker.postMessage(new Message('Test 7', MessageTypes.PersistMessage));
    worker.postMessage(new Message('Test 8', MessageTypes.PersistMessage));

    setTimeout(() => {
      done();
    }, 2000);
  });
});
