import Worker from 'worker-loader!../../worker/statePersisterWorker.js';
import WorkerMessage, { WorkerMessageTypes } from '../../worker/workerMessage';

describe('Worker service', () => {
  let worker;
  let sandbox;

  function getString(length) {
    return new Array(length + 1).join('x');
  }

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
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
