import ComponentService from './componentService';
import AppContainerFactory from '../../domain/component/appContainerFactory';
import StatePackager from '../statePackager';
import stateSyncService from '../stateSyncService';
import appFactory from '../../domain/component/appFactory';

class AppContainerService extends ComponentService {

  constructor() {
    super();
    this.statePackager = new StatePackager();
  }

  saveNew(label) {
    const appContainer = AppContainerFactory.createInstance(label);
    return this._addComponent(appContainer);
  }

  update(label) {
    const appContainer = AppContainerFactory.createInstance(label);
    return this._updateComponent(appContainer);
  }

  addApp(stateNew, jsonStateOld, label) {
    const appContainerModel = stateNew.model.appContainer;
    const app = appFactory.createInstance(appContainerModel.id, label);

    appContainerModel.children.push(app);

    const statePackage = this.statePackager.package(jsonStateOld, JSON.stringify(stateNew));
    return stateSyncService.saveStateSynchronous(statePackage);
  }

  addAppAsync(stateNew, jsonStateOld, label) {
    const appContainerModel = stateNew.model.appContainer;
    const app = appFactory.createInstance(appContainerModel.id, label);

    appContainerModel.children.push(app);

    const statePackage = this.statePackager.package(jsonStateOld, JSON.stringify(stateNew));
    return stateSyncService.saveState(statePackage);
  }
}

export default new AppContainerService();