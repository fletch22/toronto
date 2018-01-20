import { expect } from 'chai';
import stateRetriever from '../../domain/stateRetriever';
import RestService from '../../service/restService';
import stateSyncService from '../../service/stateSyncService';

describe('Current state retriever', () => {

  let sandbox = null;

  beforeEach(() => {
    // runs before each test in this block
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    // runs after each test in this block
    sandbox.restore();
  });

  it('should not call getAppContainer when state exists', (done) => {

    const getHistoricalState = sandbox.stub(stateSyncService, 'getMostRecentHistoricalState').returns(Promise.resolve({ state: '{}', isEarliestState: false, transactionId: 123 }));

    const promise = stateRetriever.getCurrent();

    promise.then(() => {
      expect(getHistoricalState.called).to.equal(true);
      done();
    });

    promise.catch((error) => {
      console.debug(error);
    });
  });
});
