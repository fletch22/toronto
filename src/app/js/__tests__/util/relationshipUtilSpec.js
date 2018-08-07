// @flow
// const sinon = require('sinon');
// import * as sinon from 'sinon';
import { expect } from 'chai';
import relationshipUtils from 'app/js/util/relationshipUtils';
import type { DescendentRelationship } from 'app/js/util/relationshipUtils';
import * as sinon from 'sinon';

describe('refUtil', () => {
  let sandbox;
  //
  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should get descendents with external source Ids', () => {
    // Arrange
    const grandChild1 = {
      id: 234
    };

    const child1 = {
      id: 123,
      children: [grandChild1]
    };

    const child2 = {
      id: 345,
      source: {},
      children: []
    };

    const state = {
      centralizedRelationships: [],
      model: {
        children: [child1, child2]
      }
    };

    relationshipUtils.createNewRef(state, child2.id, 'source', grandChild1.id);
    //
    // Act
    // relationshipUtils.getDescendentsWithExternalSourceIds(state, child1.id);

    // Assert
    // expect(false).to.equal(false);
  });
});
