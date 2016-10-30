import ComponentService from './componentService';
import StatePackager from '../statePackager';
import stateSyncService from '../stateSyncService';
import appModelFactory from '../../domain/component/appModelFactory';
import componentGenerator from '../../domain/component/componentGenerator';

class AppContainerService extends ComponentService {

  constructor() {
    super();
    this.statePackager = new StatePackager();
  }

  addAppToState(state, label) {
    const modelAppContainer = state.model.appContainer;
    const component = componentGenerator.createApp(modelAppContainer.id, label);
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
