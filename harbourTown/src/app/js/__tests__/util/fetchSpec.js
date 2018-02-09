import { expect } from 'chai';

// NOTE: For documented window.fetch see:
//    https://developers.google.com/web/updates/2015/03/introduction-to-fetch
//    https://fetch.spec.whatwg.org/#terminology-headers
//    https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
describe('window.fetch polyfill', () => {

  let sandbox;
  let fetch;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    fetch = sandbox.stub(window, 'fetch');
  });

  afterEach(() => {
    sandbox.restore();
  });

  beforeEach(() => {
    const res = new window.Response('{"hello":"world"}', {
      status: 200,
      headers: {
        'Content-type': 'application/json'
      }
    });

    fetch.returns(Promise.resolve(res));
  });

  it('should work as expected.', (done) => {
    fetch('http://foo.com')
      .then((response) => {
        response.json()
          .then((data) => {
            try {
              expect(data.hello).to.equal('world');
              expect(response.headers.get('content-type')).to.equal('application/json'); // Note that fetch forces lower case.
              expect(response.status).to.equal(200);
            } catch (err) {
              done(err);
            }
            done();
          });
      });
  });
});
