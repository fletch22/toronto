import { expect } from 'chai';
import ModelToStateGenerator from '../../stores/ModelToStateGenerator';
import defaultState from '../../state/defaultState';
import ComponentTypes from '../../domain/component/componentTypes';

describe('When ModelToStateGenerator is run', () => {
  it('and the is invoked then the object should have children.', () => {
    const modelToStateGenerator = new ModelToStateGenerator(defaultState.getInstance());
    const appContainerModel = {
      children: [
        { typeLabel: ComponentTypes.App, parentId: 123, id: 456 },
        { typeLabel: ComponentTypes.App, parentId: 789, id: 199 }
      ]
    };

    modelToStateGenerator.process(appContainerModel);
    // expect()
  });
});
