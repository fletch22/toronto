import { expect } from 'chai';
import _ from 'lodash';
import ComponentTypes from '../../../../common/domain/component/ComponentTypes';
import validationUtil from '../../util/validationUtil';

describe('validationUtils', () => {

  let sandbox = null;

  beforeEach(() => {
    // runs before each test in this block
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    // runs after each test in this block
    sandbox.restore();
  });

  it('should collect the right things.', () => {
    // Arrange
    const existingSelects = ['Select-1', 'Select-2'];

    const model = {
      app: {
        children: [
          { typeLabel: ComponentTypes.ButtonSubmit, name: existingSelects[0] },
          { typeLabel: ComponentTypes.ButtonSubmit, name: existingSelects[1] }
        ]
      }
    };

    // Act
    const isUnique = validationUtil.isUnique(model.app, 'name', 'Select-3');

    // Assert
    expect(isUnique).to.be.equal(true);
  });
});

