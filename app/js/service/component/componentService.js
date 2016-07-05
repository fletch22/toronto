import stateSyncService from '../stateSyncService';
import orbModelTraversal from '../../state/orbModelTraversal';
import _ from 'lodash';
import StatePackager from '../../service/statePackager';
class ComponentService {

  constructor() {
    this.statePackager = new StatePackager();
  }

  delete(stateNew, jsonStateOld, parentId, childId) {
    const appContainerModel = stateNew.model.appContainer;

    const parent = orbModelTraversal.find(appContainerModel, parentId);

    _.remove(parent.children, (child) => {
      return child.id === childId;
    });

    const statePackage = this.statePackager.package(jsonStateOld, JSON.stringify(stateNew));
    return stateSyncService.saveState(statePackage);
  }

  update(stateNew, jsonStateOld, id, property, newValue) {
    const appContainerModel = stateNew.model.appContainer;

    const object = orbModelTraversal.find(appContainerModel, id);

    object[property] = newValue;

    const statePackage = this.statePackager.package(jsonStateOld, JSON.stringify(stateNew));
    return stateSyncService.saveState(statePackage);
  }
}

export default ComponentService;
