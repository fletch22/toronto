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

  it('should execute addApp correctly.', (done) => {

    const promise = RestService.getAppContainer();

    promise.then((data) => {

      const json = { typeLabel: 'App', label: 'New App ' + new Date().getTime(), parent: data.id };

      const success = (data) => {
        done();
      };

      const error = (errorObj) => {
        console.log(errorObj);
        console.log(`Error: StatusCode: ${errorObj.status}: Status Text: ${errorObj.statusText}`);
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

  //it('should make a synchronous request.', () => {
  //  const remote_url = 'http://localhost:8080/vancouver/api/statePackage/';
  //  const responseText = jQuery.ajax({
  //    type: 'GET',
  //    url: remote_url,
  //    async: false
  //  }).responseText;
  //
  //  console.log(responseText);
  //});
});
