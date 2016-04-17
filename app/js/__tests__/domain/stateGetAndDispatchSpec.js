import { expect } from 'chai';
import RestService from '../../service/restService';
import stateSyncService from '../../service/stateSyncService';
import stateGetAndDispatch from '../../domain/stateGetAndDispatch';
import stateRetriever from '../../domain/stateRetriever';
import timeTravelTransaction from '../../domain/timeTravelTransaction';

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

  it('should derive the state from the model when there is no earlier state.', (done) => {

    stateGetAndDispatch.index = 2;
    const getHistoricalState = sandbox.stub(stateSyncService, 'getHistoricalState')
      .returns(Promise.resolve({ state: null, isEarliestState: true, indexOfMaxElement: 4 }));

    const dispatch = sandbox.mock();

    const promiseTest = stateGetAndDispatch.getEarlierStateAndDispatch(dispatch);

    promiseTest.then(() => {
      expect(stateGetAndDispatch.index).to.equal(5);
      expect(getHistoricalState.called).to.equal(true);
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

    const promiseTest = stateGetAndDispatch.success(data, dispatch, 2);

    promiseTest.then(() => {
      expect(deriveState.called).to.equal(false);
      expect(timeTravelTransaction.transactionId).to.equal(data.transactionId);
      done();
    });

    promiseTest.catch((error) => {
      console.log(`Error: ${error.stackTrace}`);
    });
  });

  it('should call derived state when there is not state returned from the log and there are no more states.', (done) => {

    stateGetAndDispatch.index = 2;
    const deriveState = sandbox.stub(stateRetriever, 'deriveState').returns(Promise.resolve({}));

    const dispatch = sandbox.mock();

    const data = {
      state: null,
      isEarliestState: true,
      transactionId: 123,
      indexOfMaxElement: 3
    };

    const promiseTest = stateGetAndDispatch.success(data, dispatch, 2);

    promiseTest.then(() => {
      expect(deriveState.called).to.equal(true);
      expect(stateGetAndDispatch.index).to.equal(data.indexOfMaxElement + 1);
      expect(timeTravelTransaction.transactionId).to.equal(timeTravelTransaction.TransactionSignifier.TRANSACTION_ID_BEFORE_FIRST_TRANSACTION);
      done();
    });

    promiseTest.catch((error) => {
      console.log(`Error: ${error.stackTrace}`);
      done();
    });
  });
});
