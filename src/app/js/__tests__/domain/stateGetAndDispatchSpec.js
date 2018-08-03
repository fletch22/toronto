import { expect } from 'chai';
import stateSyncService from '../../service/stateSyncService';
import stateGetAndDispatch from '../../domain/stateGetAndDispatch';


describe('Current state retriever', () => {

  let sandbox = null;

  beforeEach(() => {
    stateGetAndDispatch.index = 0;
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
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
      done(error);
    });
  });

  it('should get the state from the log but not try to derive the state.', (done) => {

    const startIndex = 267896789;
    stateGetAndDispatch.index = startIndex;

    const successHandler = sandbox.stub(stateGetAndDispatch, 'successHandler').returns(Promise.resolve());
    const getHistoricalState = sandbox.stub(stateSyncService, 'getHistoricalState').callsFake(() => {
      return Promise.resolve({ state: {}, isEarliestState: false, indexOfMaxElement: 4 });
    });

    const dispatch = sandbox.mock();

    stateGetAndDispatch.getEarlierStateAndDispatch(dispatch)
      .then(() => {
        try {
          expect(getHistoricalState.calledOnce).to.equal(true);

          const getHistArgs = getHistoricalState.getCall(0).args;

          // NOTE: Paradoxically the state history starts at zero and increments; more specifically current state is zero. Previous state is 1. Previous to 1 is 2. Etc.
          expect(getHistArgs[0]).to.equal(startIndex + 1);

          expect(successHandler.calledOnce).to.equal(true);
        } catch (err) {
          done(err);
          return;
        }
        done();
      })
      .catch(done);
  });
});
