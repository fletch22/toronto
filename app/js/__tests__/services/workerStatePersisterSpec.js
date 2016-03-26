import { expect } from 'chai';
import Worker from 'worker!../../worker/statePersisterWorker.js';
import Message, { MessageTypes } from '../../worker/message';
import Queue from '../../worker/queue';
import fetchMock from 'fetch-mock';
import stateSyncService from '../../service/stateSyncService';

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

  describe('and queue', () => {

    it('should process a success message correctly.', (done) => {

      const queue = new Queue();

      fetchMock.mock('^http', { status: 200, body: '[]' });

      const str = getString(1000);
      const message = new Message(`Test 1: ${str}`, MessageTypes.PersistMessage);
      const promise = queue.push(message.body);

      promise.then((data) => {
        fetchMock.restore();
        done();
      })
      .catch((error) => {
        fetchMock.restore();
        console.log(error);
        console.log(error.stack);
      });
    });

    it('should call rollback and fetch when 401', (done) => {

      const queue = new Queue();

      const saveStateStub = sinon.stub(stateSyncService, 'saveState').returns(Promise.reject());

      const stateHistory = [1, 2, 3, 4, 5, 6];
      const rollbackAndFetchStateHistoryStub = sinon.stub(stateSyncService, 'rollbackAndFetchStateHistory').returns(stateHistory);
      const emitEventRollbackStateStub = sinon.stub(queue, 'emitEventRollbackState');

      const message = new Message(`Test 1: ${getString(1000)}`, MessageTypes.PersistMessage);
      const promise = queue.push(message.body);

      promise.then(() => {
        fetchMock.restore();
        // Should not be called.
      })
      .catch(() => {
        fetchMock.restore();
        expect(rollbackAndFetchStateHistoryStub.called).to.be.equal(true);
        expect(saveStateStub.called).to.be.equal(true);
        expect(emitEventRollbackStateStub.called).to.be.equal(true);

        expect(emitEventRollbackStateStub.getCall(0).args.length).to.be.equal(1);
        expect(emitEventRollbackStateStub.getCall(0).args[0].length).to.be.equal(stateHistory.length);
        done();
      });
    });
  });
});

