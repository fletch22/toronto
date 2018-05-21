import { expect } from 'chai';
import stateTraversal from '../../../../common/state/stateTraversal';

describe('stateTraversal', () => {
  it('should return the highest id', () => {
    // Arrange
    const node = {
      id: 123,
      foo: {
        bar: {
          id: 124,
          delta: {
            id: 125
          }
        }
      }
    };

    // Act
    const highestId = stateTraversal.findHighestId(node);

    c.lo(node, 'node: ');

    // Assert
    expect(true).to.equal(true);
    expect(!!highestId).to.equal(true);
    expect(highestId).to.equal(125);
  });

  it('should get the ref values successfully.', () => {
    // Arrange
    const node = {
      foo: 'bar',
      $ref: 1234
    };

    // Act
    const refIds = stateTraversal.getRefIdsFromNode(node);

    c.lo(refIds, 'refIds: ');

    // Assert
    expect(refIds.length).to.equal(1);
  });
});
