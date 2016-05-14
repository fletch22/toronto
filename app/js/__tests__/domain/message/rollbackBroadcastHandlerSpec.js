import RollbackBroadcastHandler from '../../../domain/message/rollbackBroadastHandler';
import { expect } from 'chai';

describe('', () => {
  it('should catch the rollback broadcast event.', (done) => {

    const handler = new RollbackBroadcastHandler();
    const genericListener = handler.initialize();

    expect(handler).to.not.equal(null);
    expect(genericListener).to.not.equal(null);
    done();

  });
});
