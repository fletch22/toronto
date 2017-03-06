import ComponentService from './componentService';
import StatePackager from '../StatePackager';
import stateSyncService from '../stateSyncService';
import componentGenerator from '../../domain/component/componentGenerator';

// NOTE: Deprecated. Do not use parallel dom anymore.
class AppContainerService extends ComponentService {

  constructor() {
    super();
    this.statePackager = new StatePackager();
  }

  addAppToState(state, label, childId) {
    const modelAppContainer = state.model.appContainer;

    const app = {
      parentId: modelAppContainer.id,
      label,
      id: childId
    };

    const component = componentGenerator.createApp(app);
    const domAppContainer = state.dom.view.appContainer;
    this.stateInjector(modelAppContainer, domAppContainer, component);
  }

  addApp(stateNew, jsonStateOld, label) {
    this.addAppToState(stateNew, label);

    const statePackage = this.statePackager.package(jsonStateOld, JSON.stringify(stateNew));
    return stateSyncService.saveStateSynchronous(statePackage);
  }

  addAppAsync(stateNew, jsonStateOld, label) {
    this.addAppToState(stateNew, label);

    const statePackage = this.statePackager.package(jsonStateOld, JSON.stringify(stateNew));
    return stateSyncService.saveState(statePackage);
  }
}

export default new AppContainerService();
