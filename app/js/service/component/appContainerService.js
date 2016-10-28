import ComponentService from './componentService';
import StatePackager from '../statePackager';
import stateSyncService from '../stateSyncService';
import appModelFactory from '../../domain/component/appModelFactory';
import domFactory from '../../domain/component/domFactory';

class AppContainerService extends ComponentService {

  constructor() {
    super();
    this.statePackager = new StatePackager();
  }

  addApp(stateNew, jsonStateOld, label) {

    console.log('Is this invoked on startup?');

    const modelAppContainer = stateNew.model.appContainer;
    const app = appModelFactory.createInstance(modelAppContainer.id, label);

    modelAppContainer.children.push(app);
    const domAppContainer = stateNew.dom.appContainer;
    domAppContainer.children.push(domFactory.createApp(app));

    const statePackage = this.statePackager.package(jsonStateOld, JSON.stringify(stateNew));
    return stateSyncService.saveStateSynchronous(statePackage);
  }

  addAppAsync(stateNew, jsonStateOld, label) {
    const appContainerModel = stateNew.model.appContainer;
    const app = appModelFactory.createInstance(appContainerModel.id, label);

    appContainerModel.children.push(app);

    const statePackage = this.statePackager.package(jsonStateOld, JSON.stringify(stateNew));
    return stateSyncService.saveState(statePackage);
  }
}

export default new AppContainerService();
