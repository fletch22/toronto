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

  it('should call getAppContainer when no state exists because no earlier state exists.', (done) => {

    const getAppContainer = sandbox.stub(RestService, 'getAppContainer').returns(Promise.reject());
    const getHistoricalState = sandbox.stub(stateSyncService, 'getMostRecentHistoricalState').returns(Promise.resolve({ state: null, isEarliestState: false, transactionId: -1 }));

    const promise = stateRetriever.getCurrent();

    promise.then(() => {
    });

    promise.catch(() => {
      expect(getHistoricalState.called).to.equal(true);
      expect(getAppContainer.called).to.equal(true);
      done();
    });

    done();

  });

  it('should not call getAppContainer when state exists', (done) => {

    const getHistoricalState = sandbox.stub(stateSyncService, 'getMostRecentHistoricalState').returns(Promise.resolve({ state: '{}', isEarliestState: false, transactionId: 123 }));

    const promise = stateRetriever.getCurrent();

    promise.then(() => {
      expect(getHistoricalState.called).to.equal(true);
      done();
    });

    promise.catch((error) => {
      console.log(error);
    });
  });
});
