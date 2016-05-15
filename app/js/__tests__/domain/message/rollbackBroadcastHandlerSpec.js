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
    const handler = new RollbackBroadcastHandler(null);

    sandbox.stub(handler, 'showRollbackModal');
    const genericListener = handler.initialize();

    expect(handler).to.not.equal(null);
    expect(genericListener).to.not.equal(null);
  });

  it('should catch the rollback broadcast event.', (done) => {

    const handler = new RollbackBroadcastHandler(null);
    const showRollbackModal = sandbox.stub(handler, 'showRollbackModal').returns(null);

    const result = handler.initialize();

    result.promise.then(() => {
      expect(showRollbackModal.calledOnce).to.equal(true);
      done();
    });

    const event = {
      data: `{ "type": "${WorkerMessageTypes.StateRollback}" }`
    };

    result.callback(event);
  });
});
