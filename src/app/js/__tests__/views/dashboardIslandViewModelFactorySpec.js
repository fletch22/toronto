import _ from 'lodash';
import { expect } from 'chai';
import dashboardIslandViewModelFactory from '../../views/DashboardIslandViewModelFactory';
import ComponentTypes from '../../../../common/domain/component/ComponentTypes';
import defaultState from '../../state/defaultState';
import graphTraversal from '../../../../common/state/graphTraversal';


describe('DashboardIslandViewModelFactory', () => {
  const state = defaultState.getInstance();
  const APP_CONT_ID = '666A';

  beforeEach(() => {
    state.model.appContainer = {
      id: APP_CONT_ID,
      typeLabel: ComponentTypes.AppContainer,
      children: []
    };
    state.views = [];
  });

  it('createInstance should return the right object successfully', () => {
    const appContainer = graphTraversal.find(state, APP_CONT_ID);

    console.log(JSON.stringify(state.model.appContainer));

    const instance = dashboardIslandViewModelFactory.createInstance(appContainer);

    expect(instance).to.not.equal(undefined);
  });

  it.skip('bare update works correctly', () => {
    const appContainer = graphTraversal.find(state, APP_CONT_ID);

    const viewIsland = dashboardIslandViewModelFactory.createInstance(appContainer);

    state.views.push(viewIsland);

    dashboardIslandViewModelFactory.syncModelToViewModel(state, viewIsland);
  });

  it.skip('adding app update works correctly', () => {

    const appContainer = graphTraversal.find(state, APP_CONT_ID);

    // Adding existing one for chaos.
    appContainer.children.push({ id: '123A', parentId: APP_CONT_ID, typeLabel: ComponentTypes.App, label: 'AAA', children: [] });

    const viewIsland = dashboardIslandViewModelFactory.createInstance(appContainer);

    // Should see two additional ones in viewModel later.

    appContainer.children.push({ id: '123B', parentId: APP_CONT_ID, typeLabel: ComponentTypes.App, label: 'BBB', children: [] });
    appContainer.children.push({ id: '123D', parentId: APP_CONT_ID, typeLabel: ComponentTypes.App, label: 'DDD', children: [] });
    const appContViewModel = viewIsland.viewModel.children[0];

    expect(appContViewModel.viewModel.children.length).to.equal(1);

    state.views.push(viewIsland);

    dashboardIslandViewModelFactory.syncModelToViewModel(state, appContViewModel);

    expect(appContViewModel.viewModel.children.length).to.equal(3);
  });

  xit('deleting app update works correctly', () => {

    const appContainer = graphTraversal.find(state, APP_CONT_ID);
    const toBeDeleted = { id: '123D', parentId: APP_CONT_ID, typeLabel: ComponentTypes.App, label: 'SHOULD-BE-DELETED', children: [] };
    appContainer.children.push(toBeDeleted);

    const viewIsland = dashboardIslandViewModelFactory.createInstance(appContainer);

    // Clear out children implying a delete.
    appContainer.children = [];

    // Add some items for chaos.
    appContainer.children.push({ id: '123A', parentId: APP_CONT_ID, typeLabel: ComponentTypes.App, label: 'AAA', children: [] });
    appContainer.children.push({ id: '123B', parentId: APP_CONT_ID, typeLabel: ComponentTypes.App, label: 'BBB', children: [] });

    // Get the first well formed viewModel.
    const appContViewModel = viewIsland.viewModel.children[0];

    expect(appContViewModel.viewModel.children.length).to.equal(1);

    state.views.push(viewIsland);

    dashboardIslandViewModelFactory.syncModelToViewModel(state, appContViewModel);

    // There should only be the added ones now.
    expect(appContViewModel.viewModel.children.length).to.equal(2);
  });

  it.skip('findParentChildViewModel should succeed', () => {
    const appContainer = graphTraversal.find(state, APP_CONT_ID);
    appContainer.children.push({ id: '123A', parentId: APP_CONT_ID, typeLabel: ComponentTypes.App, label: 'AAA', children: [] });
    appContainer.children.push({ id: '123B', parentId: APP_CONT_ID, typeLabel: ComponentTypes.App, label: 'BBB', children: [] });
    appContainer.children.push({ id: '123D', parentId: APP_CONT_ID, typeLabel: ComponentTypes.App, label: 'DDD', children: [] });

    const viewIsland = dashboardIslandViewModelFactory.createInstance(appContainer);
    const appContViewModel = viewIsland.viewModel.children[0];

    const parentChild = dashboardIslandViewModelFactory.findParentChildViewModel(appContViewModel, APP_CONT_ID, '123B');

    expect(parentChild).to.be.ok;
    expect(parentChild.parent).to.be.ok;
    expect(parentChild.child).to.be.ok;
  });
});
