import ComponentService from './componentService';
import AppContainerFactory from '../../domain/component/appContainerFactory';

class AppContainerService extends ComponentService {

  saveNew(label) {
    const appContainer = AppContainerFactory.createInstance(label);
    return this._addComponent(appContainer);
  }

  update(label) {
    const appContainer = AppContainerFactory.createInstance(label);
    return this._updateComponent(appContainer);
  }
}

export default new AppContainerService();