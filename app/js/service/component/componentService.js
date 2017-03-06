import stateSyncService from '../stateSyncService';
import graphTraversal from '../../state/graphTraversal';
import _ from 'lodash';
import StatePackager from '../../service/StatePackager';

// NOTE: Deprecated. Do not use parallel dom anymore.
class ComponentService {

  constructor() {
    this.statePackager = new StatePackager();
  }

  delete(stateNew, jsonStateOld, parentId, childId) {
    const appContainerModel = stateNew.model.appContainer;

    const parent = graphTraversal.find(appContainerModel, parentId);

    _.remove(parent.children, (child) => {
      return child.id === childId;
    });

    const statePackage = this.statePackager.package(jsonStateOld, JSON.stringify(stateNew));
    return stateSyncService.saveState(statePackage);
  }

  update(stateNew, jsonStateOld, id, property, newValue) {
    const appContainerModel = stateNew.model.appContainer;

    const object = graphTraversal.find(appContainerModel, id);

    object[property] = newValue;

    const statePackage = this.statePackager.package(jsonStateOld, JSON.stringify(stateNew));
    return stateSyncService.saveState(statePackage);
  }

  stateInjector(parentModel, parentDom, component) {
    parentModel.children.push(component.model);
    parentDom.children.push(component.dom);
  }
}

export default ComponentService;
