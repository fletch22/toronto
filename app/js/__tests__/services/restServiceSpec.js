import RestService from '../../service/restService';
import { expect } from 'chai';
import { assert } from 'chai';

describe('Rest service', () => {

  it('should execute fetch correctly.', (done) => {

    expect(RestService).to.not.equal(null);

    const promise = RestService.getAppContainer();

    const success = (data) => {
      console.log(`Success: ${JSON.stringify(data)}`);
      done();
    };

    const error = (errorObj, obj1, obj2) => {
      console.log(obj2);
      console.log(`Error: StatusCode: ${errorObj.status}: Status Text: ${errorObj.statusText}`);
      done();
    };

    promise.then(success, error);
  });

  it('should execute addApp correctly.', (done) => {

    const promise = RestService.getAppContainer();

    promise.then((data) => {

      console.log(JSON.stringify(data.id));

      let promise = RestService.addAppToContainer(data.id, 'test');

      const success = (data) => {
        console.log(`Success: ${JSON.stringify(data)}`);
        done();
      };

      const error = (errorObj, obj1, obj2) => {
        console.log(obj2);
        console.log(`Error: StatusCode: ${errorObj.status}: Status Text: ${errorObj.statusText}`);
        done();
      };

      promise.then(success, error);
    });


  });

  it('should compose the url without exception.', () => {

    const url = RestService.getOrbServerRootUrl();
    expect(url).to.not.equal(null);

  });
});
