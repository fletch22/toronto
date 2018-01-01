import Queue from '../../worker/queue';
import GenericListener from '../../domain/message/genericListener';
import { expect } from 'chai';
import stateSyncService from '../../service/stateSyncService';
import { WorkerMessageTypes } from '../../worker/workerMessage';

describe('Queue', () => {

  let sandbox = null;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should process 1 item right away then cause other items to wait their turn.', (done) => {

    const expectedState = 'This is message #0';

    const promise = new Promise((resolve, reject) => {});

    const saveStateArray = sandbox.stub(stateSyncService, 'saveStateArray').returns(promise);
    const rollbackAndFetchStateHistory = sandbox.stub(stateSyncService, 'getMostRecentHistoricalState');

    const queue = new Queue();

    expect(queue).is.not.equal(null);

    queue.push(expectedState);
    queue.push('asdfasfd');
    queue.push('asdgasgddsfadaf');
    queue.push('asghddgsa');

    expect(3).to.equal(queue.getAccumulator().length);

    const actualStatePackage = saveStateArray.firstCall.args[0];
    expect(typeof actualStatePackage).to.equal('object');
    expect(typeof actualStatePackage.states).to.equal('object');

    const actualStates = actualStatePackage.states;
    expect(Array.isArray(actualStates)).is.true;
    expect(actualStates.length).to.equal(1);
    expect(actualStates[0]).to.equal(expectedState);
    expect(rollbackAndFetchStateHistory.callCount).to.equal(0);

    done();
  });

  it('should not process anything additional when it is paused.', () => {

    const promise = new Promise((resolve, reject) => {
      resolve({});
    });

    const saveStateArray = sandbox.stub(stateSyncService, 'saveStateArray').returns(promise);
    const rollbackAndFetchStateHistory = sandbox.stub(stateSyncService, 'getMostRecentHistoricalState');

    const queue = new Queue();

    // Should process the first thing.
    queue.push('asdfasfafdsnklmdafslkjfdasjlkadsfd');
    expect(0).to.equal(queue.getAccumulator().length);
    expect(saveStateArray.callCount).to.equal(1);

    queue.setIsAccumulatorPaused(true);

    queue.push('asdfasfafdsnklmdafslkjfdasjlkadsfd');
    queue.push('asdfasfd');
    queue.push('asdgasgddsfadaf');
    queue.push('asghddgsa');

    expect(4).to.equal(queue.getAccumulator().length);
    expect(saveStateArray.callCount).to.equal(1);
    expect(rollbackAndFetchStateHistory.callCount).to.equal(0);
  });

  it('should be unpaused and emit event when save state finishes and resolves.', (done) => {

    const saveStateArray = sandbox.spy(stateSyncService, 'saveStateArray');
    const fetch = sandbox.stub(stateSyncService, 'fetch').returns(Promise.resolve());
    const rollbackAndFetchStateHistory = sandbox.stub(stateSyncService, 'getMostRecentHistoricalState');
    const getMostRecentHistoricalStateFromNode = sandbox.stub(stateSyncService, 'getMostRecentHistoricalStateFromNode');

    expect(rollbackAndFetchStateHistory.callCount).to.equal(0);

    const queue = new Queue();

    let queueArray = queue.getAccumulator();
    expect(typeof queueArray.isAccumulatorProcessorPaused).to.equal('undefined');

    // Should process the first thing.
    const promise = queue.push('asdfasfafdsnklmdafslkjfdasjlkdsfd');

    promise.then(() => {
      expect(0).to.equal(queueArray.length);
      expect(rollbackAndFetchStateHistory.callCount).to.equal(0);
      expect(saveStateArray.callCount).to.equal(1);
      c.l(`Call count: ${fetch.callCount}`);
      expect(fetch.callCount).to.equal(2);
      queueArray = queue.getAccumulator();
      expect(queue.getQueueArrayIsPaused()).to.equal(false);
      expect(rollbackAndFetchStateHistory.callCount).to.equal(0);
      expect(getMostRecentHistoricalStateFromNode.callCount).to.equal(0);
      done();
    });
  });

  it('should get an queue error event emitted when processing.', (done) => {

    const error = {
      url: 'http:/goldilocks.ccc',
      systemMessage: 'This is the system message.',
      errorCode: 3333
    };

    const genericListener = new GenericListener();
    genericListener.register((event) => {
      const eventError = JSON.parse(event.data);
      const queueMessageType = eventError.type;
      expect(queueMessageType).to.equal(WorkerMessageTypes.Error);

      const errorActual = eventError.body;

      expect(errorActual.url).to.equal(error.url);

      genericListener.unregister();
      done();
    });

    const queue = new Queue();

    queue.emitEventError(error);
  });
});

