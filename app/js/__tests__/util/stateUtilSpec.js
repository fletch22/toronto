import { expect } from 'chai';
import stateUtils from '../../util/stateUtil';
import ComponentTypes from '../../domain/component/ComponentTypes';

describe('stateUtils', () => {

  let sandbox = null;

  beforeEach(() => {
    // runs before each test in this block
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    // runs after each test in this block
    sandbox.restore();
  });

  it('should get the unique select field.', () => {

    // Arrange
    const existingSelects = ['Select-1', 'Select-2'];
    const collectStub = sandbox.stub(stateUtils.graphTraversal, 'collectPropValuesByTypeLabelAndPropertyName').returns(existingSelects);

    // Act
    const nameUnique = stateUtils.getUniquePropertyValueAmongTypes({ model: null }, ComponentTypes.ButtonSubmit, 'name', 'Select');

    // // Assert
    expect(nameUnique).to.be.equal('Select-3');
    expect(collectStub.called).to.be.equal(true);
  });
});

