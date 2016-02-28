import RestService from '../../service/restService';
import { expect } from 'chai';

describe('Rest service', () => {

  it('should execute fetch correctly.', (done) => {

    expect(RestService).to.not.equal(null);

    const promise = RestService.fetch();

    const success = () => {
      console.log('success');
      done();
    };

    const error = () => {
      console.log('error');
      done();
    };

    promise.then(success, error);
  });
});
