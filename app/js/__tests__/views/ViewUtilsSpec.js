import { expect } from 'chai';
import viewUtils from '../../views/viewUtils';
import viewTypes from '../../views/ViewTypes';

describe('when viewUtils is invoked', () => {
  it('findSingle should return only the first instance of something', () => {

    const state = {
      views: [
        {
          viewType: 'Foo'
        },
        {
          viewType: 'Bar'
        },
        {
          viewType: 'Lemon'
        }
      ]
    };

    const thing = viewUtils.findSingle('Foo', state);
    expect(thing.viewType).is.equal('Foo');
  });

  it('findSingle should throw exception if it finds more than one instance of viewType', () => {
    const state = {
      views: [
        {
          viewType: 'Foo'
        },
        {
          viewType: 'Foo'
        },
        {
          viewType: 'Foo'
        }
      ]
    };

    let didThrowException = false;
    try {
      viewUtils.findSingle('Foo', state);
    } catch (err) {
      didThrowException = true;
    }
    expect(didThrowException).is.equal(true);
  });
});
