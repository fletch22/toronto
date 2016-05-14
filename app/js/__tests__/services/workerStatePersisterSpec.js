import { expect } from 'chai';
import WorkerMessage, { WorkerMessageTypes } from '../../worker/workerMessage';
import Queue from '../../worker/queue';
import fetchMock from 'fetch-mock';
import stateSyncService from '../../service/stateSyncService';

describe('Worker service', () => {

  function getString(length) {
    return new Array(length + 1).join('x');
  }

  let sandbox = null;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
    fetchMock.restore();
  });

  describe('and queue', () => {

    it('should process a success message correctly.', (done) => {

      const queue = new Queue();

      fetchMock.mock('^http', { status: 200, body: '[]' });

      const str = getString(1000);
      const message = new WorkerMessage(`Test 1: ${str}`, WorkerMessageTypes.PersistMessageNoGuaranteedResponse);
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

      const saveStateStub = sandbox.stub(stateSyncService, 'saveStateArray').returns(Promise.reject());

      const stateHistory = [1, 2, 3, 4, 5, 6];
      const rollbackAndFetchStateHistoryStub = sandbox.stub(stateSyncService, 'getMostRecentHistoricalState').returns(stateHistory);

      const message = new WorkerMessage(`Test 1: ${getString(1000)}`, WorkerMessageTypes.PersistMessageNoGuaranteedResponse);
      const promise = queue.push(message.body);

      promise.then(() => {
        // Should not be called.
      })
      .catch(() => {
        expect(rollbackAndFetchStateHistoryStub.called).to.be.equal(true);
        expect(saveStateStub.called).to.be.equal(true);
        done();
      });
    });
  });
});

