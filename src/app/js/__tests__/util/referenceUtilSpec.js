// @flow
import {expect} from 'chai';
import type {ReferenceDescriptor} from 'app/js/util/referenceUtils';
import referenceUtil from 'app/js/util/referenceUtils';
import * as sinon from 'sinon';
import ComponentTypes from '../../../../common/domain/component/ComponentTypes';


describe('refUtil', () => {

  const _defaultState = {
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

  const createStateWithReference = () => {
    const greatGrandChild1 = {
      id: 555,
      typeLabel: ComponentTypes.DataField
    };

    const grandChild1 = {
      id: 234,
      typeLabel: ComponentTypes.ButtonSubmit,
      children: [greatGrandChild1]
    };

    const child1 = {
      id: 123,
      typeLabel: ComponentTypes.Cylinder,
      children: [grandChild1]
    };

    const child2 = {
      id: 345,
      source: {},
      typeLabel: ComponentTypes.Div,
      children: []
    };

    const state = {
      model: {
        children: [child1, child2]
      }
    };

    const attributeWithReference = 'source';
    child1[attributeWithReference] = referenceUtil._createRawReference(child2.id, `depends on a ${child1.typeLabel}`);
    grandChild1[attributeWithReference] = referenceUtil._createRawReference(child1.id, `depends on a ${grandChild1.typeLabel}`);
    greatGrandChild1[attributeWithReference] = referenceUtil._createRawReference(grandChild1.id, `depends on a ${greatGrandChild1.typeLabel}`);

    return {
      state,
      arrowNode: child1,
      targetNode: child2,
      attributeWithReference,
      greatGrandChild1
    };
  };

  //
  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should get all references in node', () => {
    // Arrange
    const result = createStateWithReference();
    const state = result.state;

    // Act
    const references: Array<ReferenceDescriptor> = referenceUtil.getAllReferences(state);

    // Assert
    expect(1).to.equal(references.length);
    const descr = references[0];

    expect(descr.arrowAttributeName).to.equal('source');
    expect(descr.arrowId).to.equal(123);
  });

  it('should fail because delete would create orphan.', () => {
    // Arrange
    const result = createStateWithReference();
    const child = result.arrowNode;

    // Act
    const isOk = referenceUtil.isDeleteOk(child);

    // Assert
    expect(isOk).to.equal(false);
  });

  it('should succeed because delete would not create an orphan.', () => {
    // Arrange
    const result = createStateWithReference();
    const state = result.state;

    // Act
    const isOk = referenceUtil.isDeleteOk(state);

    // Assert
    expect(isOk).to.equal(true);
  });

  it('should get simple dependency collection.', () => {
    // Arrange
    const result = createStateWithReference();
    const state = result.state;
    const child = result.arrowNode;

    // Act
    const collection = referenceUtil.getDependencyCollection(state, child);

    // Assert
    expect(collection.dependeeId).to.equal(child.id);
    expect(collection.dependencies.length).to.equal(0);
  });

  it('should get dependency of target collection.', () => {
    // Arrange
    const result = createStateWithReference();
    const state = result.state;
    const targetNode = result.targetNode;

    // Act
    const collection = referenceUtil.getDependencyCollection(state, targetNode);

    // Assert
    expect(collection.dependeeId).to.equal(345);
    expect(collection.dependencies.length).to.equal(1);
    const dependentDependencies = collection.dependencies[0];
    expect(dependentDependencies.dependentId).to.equal(123);
    expect(dependentDependencies.modifierClause).to.equal('depends on a Cylinder');

    const dcDescendant = dependentDependencies.dependencyCollection;
    expect(dcDescendant.dependeeId).to.equal(123);

    const deps = dcDescendant.dependencies;
    expect(deps.length).to.equal(1);

    const tailDependency = deps[0];
    expect(tailDependency.dependentId).to.equal(234);
    expect(tailDependency.modifierClause).to.equal('depends on a Div');
  });

  it('should bring back a list of dependent IDs', () => {
    // Arrange
    const result = createStateWithReference();
    const state = result.state;
    const child = result.arrowNode;

    const dc = referenceUtil.getDependencyCollection(state, child);

    // Act
    const collection = referenceUtil.collectAllDependentIds(dc);

    // Assert
    expect(collection.length).to.equal(2);
    expect(collection.includes(234)).to.equal(true);
    expect(collection.includes(555)).to.equal(true);
  });

  it('should correctly assert that reference will be invalid', () => {
    // Arrange
    const result = createStateWithReference();
    const state = result.state;
    const child = result.arrowNode;
    const greatGrandChild1 = result.greatGrandChild1;

    // Act
    const refValidResult = referenceUtil.willBeValidReference(state, child.id, greatGrandChild1);

    // Assert
    expect(refValidResult.willBeValidReference).to.equal(false);
    expect(refValidResult.targetNode.id).to.equal(child.id);
  });

  it('should correctly assert that reference will be valid', () => {
    // Arrange
    const result = createStateWithReference();
    const state = result.state;
    const child = result.arrowNode;

    const newNode = {
      id: 'newNode',
      typeLabel: ComponentTypes.DataNarrative,
      children: []
    };

    state.model.children.push(newNode);

    // Act
    const refValidResult = referenceUtil.willBeValidReference(state, newNode.id, child);

    // Assert
    expect(refValidResult.willBeValidReference).to.equal(true);
    expect(refValidResult.targetNode.id).to.equal(newNode.id);
  });

  it.only('should correctly create a reference', () => {
    // Arrange
    const result = createStateWithReference();
    const state = result.state;
    const child = result.arrowNode;

    const newNode = {
      id: 'newNode',
      typeLabel: ComponentTypes.DataNarrative,
      children: []
    };

    state.model.children.push(newNode);

    const modifierClauseExpected = `depends on ${child.typeLabel}`;

    // Act
    const reference = referenceUtil.createReference(state, newNode, 'source', child.id, modifierClauseExpected);

    // Assert
    expect(!!reference).to.equal(true);

    expect(reference.$ref.targetId).to.equal(child.id);
    expect(reference.$ref.modifierClause).to.equal(modifierClauseExpected);
  });
});
