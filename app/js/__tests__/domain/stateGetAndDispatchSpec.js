import { expect } from 'chai';
import RestService from '../../service/restService';
import stateSyncService from '../../service/stateSyncService';
import stateGetAndDispatch from '../../domain/stateGetAndDispatch';

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
    const getAppContainer = sandbox.stub(RestService, 'getAppContainer').returns(Promise.reject());
    const getHistoricalState = sandbox.stub(stateSyncService, 'getHistoricalState').returns(Promise.resolve({ state: null, isEarliestState: true }));

    const dispatch = sandbox.mock();

    const promiseTest = stateGetAndDispatch.getEarlierStateAndDispatch(dispatch);

    promiseTest.then(() => {
      expect(stateGetAndDispatch.index).to.equal(2);
      expect(getHistoricalState.called).to.equal(true);
      expect(getAppContainer.called).to.equal(true);
      done();
    });

    promiseTest.catch((error) => {
      console.log(error);
    });
  });

  it('should derive the state from the model when there is no earlier state.', (done) => {

    const getAppContainer = sandbox.stub(RestService, 'getAppContainer').returns(Promise.reject());
    const getHistoricalState = sandbox.stub(stateSyncService, 'getHistoricalState').returns(Promise.resolve({ state: {}, isEarliestState: false }));

    const dispatch = sandbox.mock();

    const promiseTest = stateGetAndDispatch.getEarlierStateAndDispatch(dispatch);

    promiseTest.then(() => {
      expect(stateGetAndDispatch.index).to.equal(0);
      expect(getHistoricalState.called).to.equal(true);
      expect(getAppContainer.called).to.equal(false);
      done();
    });

    promiseTest.catch((error) => {
      console.log(error);
    });
  });
});
