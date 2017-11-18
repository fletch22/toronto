import RollbackBroadcastHandler from '../../../domain/message/rollbackBroadastHandler';
import { expect } from 'chai';
import { WorkerMessageTypes } from '../../../worker/workerMessage';

describe('', () => {

  let sandbox = null;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should instantiate the rollback broadcast objects.', () => {

    const dispatch = () => {};

    const handler = new RollbackBroadcastHandler(dispatch);

    sandbox.stub(handler, 'showRollbackModal');
    const genericListener = handler.initialize();

    expect(handler).to.not.equal(null);
    expect(genericListener).to.not.equal(null);
    handler.genericListener.unregister();
  });

  it('should catch the rollback broadcast event.', (done) => {

    const dispatch = () => {};
    const handler = new RollbackBroadcastHandler(dispatch);
    const showRollbackModal = sandbox.stub(handler, 'showRollbackModal').returns(null);

    const result = handler.initialize();

    result.promise.then(() => {
      expect(showRollbackModal.calledOnce).to.equal(true);
      handler.genericListener.unregister();
      done();
    });

    const event = {
      data: `{ "type": "${WorkerMessageTypes.StateRollback}", "body": 7777777 }`
    };

    result.callback(event);
  });

  it('should catch the error broadcast event.', (done) => {

    const dispatch = () => {};
    const handler = new RollbackBroadcastHandler(dispatch);
    const showErrorModal = sandbox.stub(handler, 'showErrorModal').returns(null);

    const result = handler.initialize();

    result.promise.then(() => {
      expect(showErrorModal.calledOnce).to.equal(true);
      handler.genericListener.unregister();
      done();
    });

    const event = {
      data: `{ "type": "${WorkerMessageTypes.Error}", "body": "{ 'foo': 'bar' }"  }`
    };

    result.callback(event);
  });
});
