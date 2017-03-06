import _ from 'lodash';

describe('GridLayout', () => {
  it('difference between identical objects should succeed', () => {
    const diff = _.difference({ a: 1 }, { a: 1 });

    expect(diff.length).to.equal(0);
  });

  it('difference between identical objects should show correct number of differences', () => {
    const diff = _.isEqual({ a: 2 }, { a: 1 });

    expect(diff).to.equal(false);
  });
});
