import AppModel from '../../sampleData/AppModel';
import { expect } from 'chai';
import ModelToStateTransformer from '../../stores/modelToStateTransformer';

describe('Phase State', () => {

  describe('appContainer sample data', () => {

    it('should have a zero length app array.', () => {
      expect(AppModel.apps.length).to.equal(0);
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
      expect(storeState.children.length).to.equal(1);
      expect(storeState.children[0].label).to.equal('HelloWorldApp');

    });

  });
});
