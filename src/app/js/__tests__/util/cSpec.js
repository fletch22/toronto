import { expect } from 'chai';

describe('c', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('function lo should invoke the console successfully', () => {
    const log = sandbox.stub(console, 'log');

    const foo = {};

    c.lo(foo.bar);

    expect(log.calledOnce).to.equal(true);

    const call = log.getCall(0);
    expect(call).to.not.equal(undefined);

    const arg1 = log.getCall(0).args[0];
    expect('typeof=undefined, undefined').to.equal(arg1);
  });

  it('function lo should invoke the console successfully with a prefix', () => {
    const log = sandbox.stub(console, 'log');

    const foo = {};

    c.lo(foo.bar, 'foo.bar');

    expect(log.calledOnce).to.equal(true);

    const call = log.getCall(0);
    expect(call).to.not.equal(undefined);

    const arg1 = log.getCall(0).args[0];
    expect('foo.bar -> typeof=undefined, undefined').to.equal(arg1);
  });

  it('function lo should log to the console successfully without being imported', () => {
    const log = sandbox.stub(console, 'log');

    c.lo('springbok');

    expect(log.calledOnce).to.equal(true);

    const arg1 = log.getCall(0).args[0];
    expect('typeof=string, value=springbok').to.equal(arg1);
  });

  it('function lo should log an object to the console successfully without being imported', () => {
    const log = sandbox.stub(console, 'log');

    c.lo({ id: 123, value: 'gazelle' });

    expect(log.calledOnce).to.equal(true);

    const arg1 = log.getCall(0).args[0];
    expect('typeof=object, json={"id":123,"value":"gazelle"}, enumerableProps:["id","value"]').to.equal(arg1);
  });

  it('function lo should log an iterator to the console successfully', () => {
    const log = sandbox.stub(console, 'log');

    function* makeSimpleGenerator(array) {
      let nextIndex = 0;

      while (nextIndex < array.length) {
        yield array[nextIndex++];
      }
    }

    const generator1 = makeSimpleGenerator(['yo', 'ya']);

    c.lo(generator1);

    const arg1 = log.getCall(0).args[0];

    expect('typeof=iterable, json=["yo","ya"]').to.equal(arg1);
  });

  it('function lo should log an array to the console successfully', () => {
    const log = sandbox.stub(console, 'log');
    const array1 = ['yo', 'ya'];

    c.lo(array1);

    const arg1 = log.getCall(0).args[0];

    expect('typeof=array, json=["yo","ya"]').to.equal(arg1);
  });

  it('function \'l\' should log to the console successfully without being imported', () => {
    const log = sandbox.stub(console, 'log');

    c.l('boar');

    expect(log.calledOnce).to.equal(true);
  });

  it('function \'lo\' should handle numbers successfully.', () => {
    const log = sandbox.stub(console, 'log');

    c.lo(123);

    expect(log.calledOnce).to.equal(true);

    const call = log.getCall(0);

    const arg1 = log.getCall(0).args[0];

    expect(arg1).to.equal('typeof=number, 123');
  });
});
