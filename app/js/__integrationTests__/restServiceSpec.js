import RestService from '../service/restService';
import { expect } from 'chai';

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

    promise.then(success, error);
  });

  it('should execute addApp correctly.', (done) => {

    const promise = RestService.getAppContainer();

    promise.then((data) => {

      const json = { typeLabel: 'App', label: 'New App ' + new Date().getTime(), parent: data.id };
      const promiseInner = RestService.addComponent(json);

      const success = (data) => {
        console.log(data);
        done();
      };

      const error = (errorObj) => {
        console.log(errorObj);
        console.log(`Error: StatusCode: ${errorObj.status}: Status Text: ${errorObj.statusText}`);
        assert.fail(true, false);
        done();
      };

      promiseInner.then(success, error);
    });
  });

  it('should compose the url without exception.', () => {

    const url = RestService.getOrbServerRootUrl();
    expect(url).to.not.equal(null);

  });

  it('should get the component from an id.', (done) => {

    const promise = RestService.getComponent(1041);

    const success = (data) => {
      done();
    };

    const error = (errorObj) => {
      console.log(`Error: StatusCode: ${errorObj.status}: Status Text: ${errorObj.statusText}`);
      assert.fail(true, false);
      done();
    };

    promise.then(success, error);
  });
});
