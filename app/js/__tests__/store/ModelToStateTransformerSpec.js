import AppModel from '../../sampleData/AppModel';
import { expect } from 'chai';
import ModelToStateTransformer from '../../stores/modelToStateTransformer';

describe('Phase State', () => {

  describe('appContainer sample data', () => {

    it('should have a zero length children.', () => {
      expect(AppModel.children.list.length).to.equal(1);
    });

  });

  describe('transformer', () => {

    it('should validate the data correctly', () => {

      const isValid = ModelToStateTransformer.isValid(AppModel);
      expect(isValid).to.equal(true);

    });

    it('should transform correctly', () => {

      const storeState = ModelToStateTransformer.transform(AppModel);

      expect(ModelToStateTransformer).to.not.equal(null);
      expect(storeState.model.appContainer.children.length).to.equal(1);
      expect(storeState.model.appContainer.children[0].label).to.equal('HelloWorldApp');
    });

  });
});
