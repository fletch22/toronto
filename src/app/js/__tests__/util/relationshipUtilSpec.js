// @flow
import {expect} from 'chai';
import type {DescendantRelationship} from 'app/js/util/relationshipUtils';
import relationshipUtils from 'app/js/util/relationshipUtils';
import * as sinon from 'sinon';
import stateTraversal from 'common/state/stateTraversal';


describe('refUtil', () => {

  const _defaultState = {
    centralizedRelationships: [],
    model: {
      children: []
    }
  };

  const getDefaultState = () => {
    return _.cloneDeep(_defaultState);
  };

  let sandbox;

  const getTestChild = (id) => ({
    id: id,
    children: []
  });

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

    relationshipUtils.createRelationship(state, child2, 'source', grandChild1.id);

    // Act
    const descs: Array<DescendantRelationship> = relationshipUtils._getDescendantsWithExternalSourceIds(state, child1.id);

    // Assert
    expect(1).to.equal(descs.length);
  });

  it('should create a new ref successfully.', () => {
    // Arrange
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

    const sourceAttribute = 'source';

    // Act
    const rel = relationshipUtils.createRelationship(state, child2, sourceAttribute, grandChild1.id);

    // Assert
    expect(rel !== null).to.equal(true);
    expect(!!state.centralizedRelationships).to.equal(true);
    expect(state.centralizedRelationships.length).to.equal(1);
    const relFromState = state.centralizedRelationships[0];

    expect(child2.id).to.equal(relFromState.arrowId);
    expect(grandChild1.id).to.equal(relFromState.targetId);
    expect(sourceAttribute).to.equal(relFromState.arrowAttributeName);
  });

  it('should get descendants that are targets successfully.', () => {
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

    const sourceAttribute = 'source';
    const rel = relationshipUtils.createRelationship(state, child1, sourceAttribute, grandChild1.id);

    // Act
    const descs = relationshipUtils._getDescendantsThatAreTargets(state, state.model);

    // Assert
    expect(descs !== null).to.equal(true);
    expect(Array.isArray(descs)).to.equal(true);
    expect(descs.length).to.equal(1);
    expect(descs[0].id === grandChild1.id);
  });

  it('should get descendants with endogenous source IDs (future orphans if deleted).', () => {
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

    const sourceAttribute = 'source';
    const rel = relationshipUtils.createRelationship(state, child2, sourceAttribute, grandChild1.id);

    // Act
    const descs = relationshipUtils._getDescendantsWithExternalSourceIds(state, child1.id);

    // Assert
    expect(descs !== null).to.equal(true);
    expect(Array.isArray(descs)).to.equal(true);
    expect(descs.length).to.equal(1);
    expect(descs[0].id === grandChild1.id);
  });

  it('should get the relationship.', () => {
    // Arrange
    const sourceAttributeName = 'source';

    const state = getDefaultState();
    const child1 = getTestChild(123);
    child1[sourceAttributeName] = 'foo';
    state.model.children.push(child1);

    const child2 = getTestChild(234);

    const ref = relationshipUtils.createRelationship(state, child1, sourceAttributeName, child2.id);

    // Act
    const refActual = relationshipUtils.getRelationship(state, ref.id);

    // Assert
    expect(ref.id).to.equal(refActual.id);
    expect(ref.arrowAttributeName).to.equal(refActual.arrowAttributeName);
    expect(ref.targetId).to.equal(refActual.targetId);
  });

  it('should throw an exception when creating relationship that exists.', () => {
    // Arrange
    const sourceAttributeName = 'source';

    const state = getDefaultState();
    const child1 = getTestChild(123);
    child1[sourceAttributeName] = 'foo';
    state.model.children.push(child1);

    const child2 = getTestChild(234);

    relationshipUtils.createRelationship(state, child1, sourceAttributeName, child2.id);

    // Act
    let didThrow = false;
    try {
      relationshipUtils.createRelationship(state, child1, sourceAttributeName, child2.id);
    } catch (e) {
      didThrow = true;
    }

    // Assert
    expect(didThrow).to.equal(true);
  });

  it('should delete a relationship.', () => {
    // Arrange
    const sourceAttributeName1 = 'source';
    const sourceAttributeName2 = 'anotherSource';

    const state = getDefaultState();
    const child1 = getTestChild(123);
    child1[sourceAttributeName1] = 'foo';
    state.model.children.push(child1);

    const child2 = getTestChild(234);

    const rel = relationshipUtils.createRelationship(state, child1, sourceAttributeName1, child2.id);
    relationshipUtils.createRelationship(state, child1, sourceAttributeName2, child2.id);

    // Act
    const deletedRelationship = relationshipUtils.deleteRelationshipByRelationshipId(state, rel.id);

    // Assert
    const relAfterDel = relationshipUtils.getRelationship(state, rel.id);

    expect(relAfterDel).to.equal(undefined);
    expect(rel.id).to.equal(deletedRelationship.id);
  });

  it('should fail to delete a relationship when it doesn\'t exist', () => {
    // Arrange
    let didThrow = false;
    const state = getDefaultState();

    // Act
    try {
      relationshipUtils.deleteRelationshipByRelationshipId(state, 234);
    } catch (error) {
      didThrow = true;
    }

    // Assert
    expect(didThrow).to.equal(true);
  });

  it('should delete a relationship by source attribute name', () => {
    // Arrange
    const sourceAttributeName1 = 'source';
    const sourceAttributeName2 = 'anotherSource';

    const state = getDefaultState();
    const child1 = getTestChild(123);
    child1[sourceAttributeName1] = 'foo';
    state.model.children.push(child1);

    const child2 = getTestChild(234);

    const rel = relationshipUtils.createRelationship(state, child1, sourceAttributeName1, child2.id);
    relationshipUtils.createRelationship(state, child1, sourceAttributeName2, child2.id);

    // Act
    const deletedRelationship = relationshipUtils.deleteRelationshipBySourceAttribute(state, child1.id, sourceAttributeName1);

    // Assert
    const relAfterDel = relationshipUtils.getRelationship(state, rel.id);

    expect(relAfterDel).to.equal(undefined);
    expect(rel.id).to.equal(deletedRelationship.id);
  });

  it('should delete a relationship by source attribute name', () => {
    // Arrange
    const sourceAttributeName1 = 'source';

    const state = getDefaultState();
    const child1 = getTestChild(123);
    child1[sourceAttributeName1] = stateTraversal.createReference(234);

    let didThrow = false;

    // Act
    try {
      relationshipUtils.validateForDeletion(state, child1, sourceAttributeName1);
    } catch (error) {
      didThrow = true;
    }
    // Assert
    expect(didThrow).to.equal(false);
  });

  it('should throw when delete a relationship by source attribute name and source does not have ref object', () => {
    // Arrange
    const sourceAttributeName1 = 'source';

    const state = getDefaultState();
    const child1 = getTestChild(123);
    child1[sourceAttributeName1] = 'thisisastring';

    let didThrow = false;

    // Act
    try {
      relationshipUtils.validateForDeletion(state, child1, sourceAttributeName1);
    } catch (error) {
      didThrow = true;
    }
    // Assert
    expect(didThrow).to.equal(true);
  });

  it('should throw when delete a relationship by source attribute name and source attribute value is null', () => {
    // Arrange
    const sourceAttributeName1 = 'source';

    const state = getDefaultState();
    const child1 = getTestChild(123);
    child1[sourceAttributeName1] = null;

    let didThrow = false;

    // Act
    try {
      relationshipUtils.validateForDeletion(state, child1, sourceAttributeName1);
    } catch (error) {
      didThrow = true;
    }
    // Assert
    expect(didThrow).to.equal(true);
  });

  it('should throw when delete a relationship by source attribute name and source attribute name is wrong.', () => {
    // Arrange
    const sourceAttributeName1 = 'source';

    const state = getDefaultState();
    const child1 = getTestChild(123);
    child1[sourceAttributeName1] = null;

    let didThrow = false;

    // Act
    try {
      relationshipUtils.validateForDeletion(state, child1, 'thispropertydoesnotexist');
    } catch (error) {
      didThrow = true;
    }
    // Assert
    expect(didThrow).to.equal(true);
  });

  it('should throw when delete a relationship by source attribute name when nodeSource is falsey', () => {
    // Arrange
    const sourceAttributeName1 = 'source';
    const state = getDefaultState();
    let didThrow = false;

    // Act
    try {
      relationshipUtils.validateForDeletion(state, undefined, sourceAttributeName1);
    } catch (error) {
      didThrow = true;
    }
    // Assert
    expect(didThrow).to.equal(true);
  });
});
