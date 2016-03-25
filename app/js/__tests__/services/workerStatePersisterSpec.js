import { expect } from 'chai';
import Worker from 'worker!../../worker/statePersisterWorker.js';
import StatePersisterWorker from '../../worker/statePersisterWorker.js';
import Message, { MessageTypes } from '../../worker/message';
import Queue from '../../worker/queue';
import fetchMock from 'fetch-mock';

describe('Worker service', () => {
  const worker = new Worker();

  before(() => {
    // NOTE: Fixed in sinon 2.0. Until then, this is necessary.
    /* eslint no-undef: 0 */
    // server = sinon.fakeServer.create();

    // sinon.stub(window, 'fetch');
  });

  after(() => {
    // server.restore();
    // window.fetch.restore();
  });

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

  describe('The queue', () => {

    it('The queue should process a success message correctly.', (done) => {

      const queue = new Queue();

      fetchMock.mock('^http', 200);

      const str = getString(1000);
      const message = new Message(`Test 1: ${str}`, MessageTypes.PersistMessage);
      const promise = queue.push(message.body);

      promise.then(() => {
        fetchMock.restore();
        done();
      })
      .catch((error) => {
        console.log(error);
        console.log(error.stack);
      });
    });

    it('The queue should process a 401 error correctly.', (done) => {

      const queue = new Queue();

      fetchMock.mock('^http', { status: 401 });

      const str = getString(1000);
      const message = new Message(`Test 1: ${str}`, MessageTypes.PersistMessage);
      const promise = queue.push(message.body);

      promise.then(() => {
        // Should not be called.
      })
      .catch((error) => {
        fetchMock.restore();
        done();
      });
    });

  });


});

