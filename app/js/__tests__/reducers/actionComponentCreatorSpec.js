import { expect } from 'chai';
import layoutModelFactory from '../../domain/component/layoutModelFactory';
import actionComponentCreator from '../../reducers/actionComponentCreator';
import ComponentTypes from '../../domain/component/ComponentTypes';

describe('actionComponentCreator', () => {
  it('create a faithful model out of a view model', () => {

    const layoutModel = layoutModelFactory.createInstance('foo');
    const viewModel = actionComponentCreator.generateViewModel(123, layoutModel);

    const model = actionComponentCreator.extractModelFromViewModel(viewModel);

    expect(viewModel).to.not.equal(undefined);
    expect(model.parentId).to.equal('foo');
    expect(model.id.length).to.be.above(12);
    expect(model.children.length).to.be.equal(0);
    expect(model.typeLabel).to.equal(ComponentTypes.Layout);
  });
});
