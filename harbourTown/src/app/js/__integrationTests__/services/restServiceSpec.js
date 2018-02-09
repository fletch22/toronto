import RestService from '../../service/restService';
import { expect, assert } from 'chai';
import jQuery from 'jquery'

describe('Rest service', () => {

  it('should execute fetch correctly.', (done) => {

    expect(RestService).to.not.equal(null);

    const promise = RestService.getAppContainer();

    const success = (data) => {
      done();
    };

    const error = (errorObj) => {
      const message = `Error: StatusCode: ${errorObj.status}: Status Text: ${errorObj.statusText}`;
      assert.fail(message, 'Call to get appContainer succeeded.');
      done();
    };

    promise.then(success).catch(error);
  });

  it('should execute createApp correctly.', (done) => {

    const promise = RestService.getAppContainer();

    promise.then((data) => {

      const json = { typeLabel: 'App', label: 'New App ' + new Date().getTime(), parent: data.id };

      const success = (data) => {
        done();
      };

      const error = (errorObj) => {
        console.error(errorObj);
        console.error(`Error: StatusCode: ${errorObj.status}: Status Text: ${errorObj.statusText}`);
        assert.fail(true, false);
        done();
      };

      promise.then(success).catch(error);
    });
  });

  it('should compose the url without exception.', () => {
    const url = RestService.getOrbServerRootUrl();
    expect(url).to.not.equal(null);
  });

  it('should handle exception well.', (done) => {
    const promise = RestService.getExceptionForTesting();

    promise.then((response) => {
      console.debug(response);
      assert.fail('Should not see this message. The call should fail with an exception.');
    });

    promise.catch((error) => {
      console.error(error.message);
      done();
    });
  });
});
