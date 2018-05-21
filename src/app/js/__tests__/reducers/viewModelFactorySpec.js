import { expect } from 'chai';
import buttonSubmitModelFactory from '../../domain/component/buttonSubmitModelFactory';
import actionComponentCreator from '../../reducers/viewModelFactory';
import ComponentTypes from '../../../../common/domain/component/ComponentTypes';

describe('viewModelFactory', () => {
  it('create a faithful model out of a view model', () => {

    const buttonSubmit = buttonSubmitModelFactory.createInstanceFromModel({ elementId: 'bar', parentId: 'foo', ordinal: 2, style: '1ps solid red' });
    const viewModel = actionComponentCreator.generateViewModel(123, buttonSubmit);

    const model = actionComponentCreator.extractModelFromViewModel(viewModel);

    expect(viewModel).to.not.equal(undefined);
    expect(model.parentId).to.equal('foo');
    expect(viewModel.parentId).to.equal(123);
    expect(model.id.length).to.be.above(12);
    expect(model.children.length).to.be.equal(0);
    expect(model.typeLabel).to.equal(ComponentTypes.ButtonSubmit);
  });
});
