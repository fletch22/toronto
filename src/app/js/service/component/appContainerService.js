import ComponentService from './componentService';
import StatePackager from '../StatePackager';
import stateSyncService from '../stateSyncService';
import ComponentTypes from '../../../../common/domain/component/ComponentTypes';
import stateTraversal from '../../state/stateTraversal';
import appModelFactory from '../../domain/component/appModelFactory';
import DomFactory from '../../domain/component/DomFactory';
import dashboardIslandViewFactory from '../../views/DashboardIslandViewModelFactory';

// NOTE: Deprecated. Do not use parallel dom anymore.
class AppContainerService extends ComponentService {

  constructor() {
    super();
    this.statePackager = new StatePackager();
  }

  addAppToState(state, label) {
    const appContainer = state.model.appContainer;

    const id = stateTraversal.getNextId(state);

    let app = {
      id,
      parentId: appContainer.id,
      label
    };

    app = appModelFactory.createInstance(app);
    appContainer.children.push(app);

    const islandView = dashboardIslandViewFactory.createInstance(appContainer);

    /* eslint-disable no-param-reassign */
    state.views = [islandView];
  }

  addAppAsync(stateNew, jsonStateOld, label) {
    this.addAppToState(stateNew, label);

    const statePackage = this.statePackager.package(jsonStateOld, JSON.stringify(stateNew));
    return stateSyncService.saveState(statePackage);
  }
}

export default new AppContainerService();
