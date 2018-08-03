import _ from 'lodash';
import { expect } from 'chai';
import actionBodyChildSelectorHandler from '../../reducers/actionBodyChildSelectorHandler';
import viewModelFactory from '../../reducers/viewModelFactory';
import graphTraversal from '../../../../common/state/graphTraversal';
import ComponentTypes from '../../../../common/domain/component/ComponentTypes';

describe('actionBodySelector', () => {

  let state = {
    id: 'viewIdRoot',
    isSelected: false,
    parentId: viewModelFactory.WEB_PAGE_ROOT,
    selectedChildViewId: 'viewId1',
    selectedViewModel: {
      viewModel: {
        typeLabel: 'foo'
      }
    },
    viewModel: {
      id: '12341432',
      pageName: 'ThePageName',
      typeLabel: ComponentTypes.WebPage,
      children: [
        {
          id: 'viewId1',
          parentId: 'viewIdRoot',
          viewModel: {
            id: 'some-orb-id-1',
            parentId: 'some-orb-id-2',
            children: [
              {
                id: 'viewId2',
                parentId: 'viewId1',
                viewModel: {
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

  it.skip('should select viewId2 node and deselect other selected nodes', () => {
    const targetChildView = 'viewId2';
    let stateClone = _.cloneDeep(state);
    stateClone = actionBodyChildSelectorHandler.process(stateClone, targetChildView);

    expect(stateClone.selectedChildViewId).to.equal(targetChildView);
    expect(stateClone).to.not.equal(undefined);
    expect(stateClone.borderScrivener.selectedElementId).to.equal(targetChildView);

  });

  it.skip('should select viewId1 node and deselect other selected nodes', () => {
    const stateClone = _.cloneDeep(state);

    state = actionBodyChildSelectorHandler.process(stateClone, 'viewId1');

    expect(stateClone.selectedChildViewId).to.equal('viewId1');

    expect(stateClone).to.not.equal(undefined);
  });

  it('should select the root and deselect other selected nodes', () => {
    const stateClone = _.cloneDeep(state);

    state = actionBodyChildSelectorHandler.process(stateClone, 'viewIdRoot');

    expect(stateClone.selectedChildViewId).to.equal('viewIdRoot');

    expect(stateClone).to.not.equal(undefined);
    const viewModel1 = graphTraversal.find(stateClone, 'viewId1');

    const viewModel2 = graphTraversal.find(stateClone, 'viewId2');
  });
});
