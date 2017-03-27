import _ from 'lodash';
import { expect } from 'chai';
import actionBodyChildSelectorHandler from '../../reducers/actionBodyChildSelectorHandler';
import viewModelFactory from '../../reducers/viewModelFactory';
import graphTraversal from '../../state/graphTraversal';

describe('actionBodySelector', () => {

  let state = {
    id: 'viewIdRoot',
    isSelected: false,
    parentId: viewModelFactory.WEB_PAGE_ROOT,
    selectedChildViewId: 'viewId1',
    viewModel: {
      id: '12341432',
      pageName: 'ThePageName',
      children: [
        {
          id: 'viewId1',
          isSelected: true,
          parentId: 'viewIdRoot',
          viewModel: {
            id: 'some-orb-id-1',
            parentId: 'some-orb-id-2',
            children: [
              {
                id: 'viewId2',
                isSelected: false,
                parentId: 'viewId1',
                viewMode: {
                  id: 'some-orb-id-3',
                  parentId: 'some-orb-id-1'
                }
              }
            ]
          }
        }
      ]
    }
  };

  it('should select viewId2 node and deselect other selected nodes', () => {
    const stateClone = _.cloneDeep(state);

    const viewModel1 = graphTraversal.find(stateClone, 'viewId1');

    expect(viewModel1.isSelected).to.equal(true);

    state = actionBodyChildSelectorHandler.process(stateClone, 'viewId2');

    expect(stateClone.selectedChildViewId).to.equal('viewId2');
    expect(stateClone.isSelected).to.equal(false);

    expect(stateClone).to.not.equal(undefined);
    expect(viewModel1.isSelected).to.equal(false);

    const viewModel2 = graphTraversal.find(stateClone, 'viewId2');
    expect(viewModel2.isSelected).to.equal(true);
  });

  it('should select viewId1 node and deselect other selected nodes', () => {
    const stateClone = _.cloneDeep(state);

    state = actionBodyChildSelectorHandler.process(stateClone, 'viewId1');

    expect(stateClone.selectedChildViewId).to.equal('viewId1');
    expect(stateClone.isSelected).to.equal(false);

    expect(stateClone).to.not.equal(undefined);
    const viewModel1 = graphTraversal.find(stateClone, 'viewId1');
    expect(viewModel1.isSelected).to.equal(true);

    const viewModel2 = graphTraversal.find(stateClone, 'viewId2');
    expect(viewModel2.isSelected).to.equal(false);
  });

  it('should select the root and deselect other selected nodes', () => {
    const stateClone = _.cloneDeep(state);

    state = actionBodyChildSelectorHandler.process(stateClone, 'viewIdRoot');

    expect(stateClone.selectedChildViewId).to.equal('viewIdRoot');
    expect(stateClone.isSelected).to.equal(true);

    expect(stateClone).to.not.equal(undefined);
    const viewModel1 = graphTraversal.find(stateClone, 'viewId1');
    expect(viewModel1.isSelected).to.equal(false);

    const viewModel2 = graphTraversal.find(stateClone, 'viewId2');
    expect(viewModel2.isSelected).to.equal(false);
  });
});
