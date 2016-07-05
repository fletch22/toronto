import { expect } from 'chai';
import RestService from '../../service/restService';
import stateSyncService from '../../service/stateSyncService';
import stateGetAndDispatch from '../../domain/stateGetAndDispatch';
import stateRetriever from '../../domain/stateRetriever';

describe('Current state retriever', () => {

  let sandbox = null;

  beforeEach(() => {
    // runs before each test in this block
    stateGetAndDispatch.index = 0;
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    // runs after each test in this block
    sandbox.restore();
  });

  it('should do nothing when there is no earlier state.', (done) => {

    const expectedIndex = 2;
    stateGetAndDispatch.index = expectedIndex;
    const getHistoricalState = sandbox.stub(stateSyncService, 'getHistoricalState')
      .returns(Promise.resolve({ state: null, isEarliestState: true, indexOfMaxElement: 4 }));

    const dispatch = sandbox.mock();

    const promiseTest = stateGetAndDispatch.getEarlierStateAndDispatch(dispatch);

    promiseTest.then(() => {
      expect(getHistoricalState.called).to.equal(true);
      expect(stateGetAndDispatch.index).to.equal(expectedIndex);
      done();
    });

    promiseTest.catch((error) => {
      console.log(`Error: ${error}`);
    });
  });

  it('should get the state from the log but not try to derive the state.', (done) => {

    const getAppContainer = sandbox.stub(RestService, 'getAppContainer').returns(Promise.reject());
    const getHistoricalState = sandbox.stub(stateSyncService, 'getHistoricalState')
      .returns(Promise.resolve({ state: {}, isEarliestState: false, indexOfMaxElement: 4 }));

    const dispatch = sandbox.mock();

    const promiseTest = stateGetAndDispatch.getEarlierStateAndDispatch(dispatch);

    promiseTest.then(() => {
      expect(stateGetAndDispatch.index).to.equal(0);
      expect(getHistoricalState.called).to.equal(true);
      expect(getAppContainer.called).to.equal(false);
      done();
    });

    promiseTest.catch((error) => {
      console.log(`Error: ${error}`);
    });
  });

  it('should reset state to currently selected state when invoked', (done) => {

    stateGetAndDispatch.index = 2;
    const deriveState = sandbox.stub(stateRetriever, 'deriveState').returns(Promise.resolve({}));
    const dispatch = sandbox.mock();

    const data = {
      state: '{}',
      isEarliestState: false,
      transactionId: 123
    };

    const promiseTest = stateGetAndDispatch.successHandler(data, dispatch, 2);

    promiseTest.then(() => {
      expect(deriveState.called).to.equal(false);
      done();
    });

    promiseTest.catch((error) => {
      console.log(`Error: ${error.stackTrace}`);
    });
  });
});
