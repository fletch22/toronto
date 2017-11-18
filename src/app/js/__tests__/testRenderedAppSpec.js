import TestRenderedApp from './testRenderedApp';
import { expect } from 'chai';

describe('The test rendered app', () => {

  let sandbox = null;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should return the correct object', (done) => {
    const testRenderedApp = new TestRenderedApp(sandbox);
    const promise = testRenderedApp.setup(sandbox);

    promise.then((result) => {
      expect(result).to.be.a('object');
      expect(result.store).to.be.a('object');
      expect(result.renderedComponent).to.be.a('object');
      done();
    });
  });
});
