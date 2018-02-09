import util from '../../util/util';
import { expect } from 'chai';

describe('util', () => {
  it('doArrayElementsMatchIdentities should detect a change in the children successfully.', () => {
    const array1 = null;
    const array2 = undefined;

    const doesMatch = util.doArrayElementsMatchIdentities(array1, array2);

    expect(doesMatch).to.equal(true);
  });

  it('doArrayElementsMatchIdentities should fail when one array is undefined.', () => {
    const array1 = undefined;
    const array2 = [];

    const doesMatch = util.doArrayElementsMatchIdentities(array1, array2);

    expect(doesMatch).to.equal(true);
  });

  it('doArrayElementsMatchIdentities should succeed when both have identical arrays.', () => {
    const orb1 = {};
    const orb2 = {};

    const array1 = [orb1, orb2];
    const array2 = [orb1, orb2];

    const doesMatch = util.doArrayElementsMatchIdentities(array1, array2);

    expect(doesMatch).to.equal(true);
  });

  it('doArrayElementsMatchIdentities should fail when both have identical arrays in different order.', () => {
    const orb1 = {};
    const orb2 = {};

    const array1 = [orb1, orb2];
    const array2 = [orb2, orb1];

    const doesMatch = util.doArrayElementsMatchIdentities(array1, array2);

    expect(doesMatch).to.equal(false);
  });
});
