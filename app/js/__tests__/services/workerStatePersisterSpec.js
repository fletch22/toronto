import { expect } from 'chai';
import Message, { MessageTypes } from '../../worker/message';
import Queue from '../../worker/queue';
import fetchMock from 'fetch-mock';
import stateSyncService from '../../service/stateSyncService';

describe('Worker service', () => {

  function getString(length) {
    return new Array(length + 1).join('x');
  }

  afterEach(() => {
    fetchMock.restore();
  });

  describe('and queue', () => {

    it('should process a success message correctly.', (done) => {

      const queue = new Queue();

      fetchMock.mock('^http', { status: 200, body: '[]' });

      const str = getString(1000);
      const message = new Message(`Test 1: ${str}`, MessageTypes.PersistMessage);
      const promise = queue.push(message.body);

      promise.then(() => {
        done();
      })
      .catch((error) => {
        console.log(`Error: ${error.stack}`);
      });
    });

    it('should call rollback and fetch when 401', (done) => {

      const queue = new Queue();

      fetchMock.mock('^http', { status: 200, body: '[]' });

      const saveStateStub = sinon.stub(stateSyncService, 'saveStateArray').returns(Promise.reject());

      const stateHistory = [1, 2, 3, 4, 5, 6];
      const rollbackAndFetchStateHistoryStub = sinon.stub(stateSyncService, 'rollbackAndFetchStateHistory').returns(stateHistory);
      const emitEventRollbackStateStub = sinon.stub(queue, 'emitEventRollbackState');

      const message = new Message(`Test 1: ${getString(1000)}`, MessageTypes.PersistMessage);
      const promise = queue.push(message.body);

      promise.then(() => {
        // Should not be called.
      })
      .catch(() => {
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

