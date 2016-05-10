import Worker from 'worker!../../worker/statePersisterWorker.js';
import WorkerMessage, { WorkerMessageTypes } from '../../worker/workerMessage';
import stateSyncService from '../../service/stateSyncService';
import { expect } from 'chai';

describe('Worker service', () => {
  let worker;
  let sandbox;

  function getString(length) {
    return new Array(length + 1).join('x');
  }

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should execute save ideal messages correctly.', (done) => {
    worker = new Worker();

    worker.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      console.log(JSON.stringify(message));
      done();
    });

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

  it('should execute pause and drain.', (done) => {

    worker = new Worker();

    const str = getString(1000);
    const message = new WorkerMessage(`Test 1: ${str}`, WorkerMessageTypes.BlockadeAndDrain);

    worker.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      done();
    });

    console.log('About to post message.');
    worker.postMessage(message);
  });
});
