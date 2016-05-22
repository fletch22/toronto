import F22Uuid from '../../util/f22Uuid';
import { expect } from 'chai';
import uuid from 'node-uuid';
import _ from 'lodash';

describe('F22Uuid', () => {

  it('should generate ids that have the correct properties.', () => {
    const id = F22Uuid.generate();
    expect(id).to.not.equal(null);

    const uuidSample = uuid.v1();

    expect(id.length).to.equal(uuidSample.length);
  });

  it('should generate ids that sort correctly.', () => {

    let genArray = [];
    const max = 1000;
    for (let i = 0; i < max; i++) {
      const id = F22Uuid.generate();
      genArray.push({ id, index: i });
    }

    const collectionSortedByIds = _.sortBy(genArray, 'id');
    const collectionSortedByIndex = _.sortBy(genArray, 'index');

    for (let i = 0; i < collectionSortedByIds.length; i++) {
      const byIdUuid = collectionSortedByIds[i];
      const byIndexUuid = collectionSortedByIndex[i];

      expect(byIdUuid).to.equal(byIndexUuid);
    }
  });
});
