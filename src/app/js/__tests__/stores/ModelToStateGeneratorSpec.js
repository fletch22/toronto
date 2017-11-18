import { expect } from 'chai';
import ModelToStateGenerator from '../../stores/ModelToStateGenerator';
import defaultState from '../../state/defaultState';
import AppModel from '../../sampleData/AppModel';

describe('When ModelToStateGenerator is run', () => {

  const isValid = function (model) {
    let result = false;
    if (model.parentId === 0 // NOTE: Little bit leaky abstraction here.
      && model.children.haveChildrenBeenResolved) {
      result = true;
    }
    return result;
  };

  it('and the is invoked then the object should have children.', () => {

    const state = defaultState.getInstance();
    const modelToStateGenerator = new ModelToStateGenerator(state);
    modelToStateGenerator.process(AppModel);

    expect(state.dom.view.appContainer.children.length).to.equal(1);
    expect(state.model.appContainer.children.length).to.equal(1);
  });

  describe('appContainer sample data', () => {

    it('should have a zero length children.', () => {
      expect(AppModel.children.list.length).to.equal(1);
    });

  });

  describe('transformer', () => {

    it('should validate the data correctly', () => {

      const isValidy = isValid(AppModel);
      expect(isValidy).to.equal(true);

    });
  });
});
