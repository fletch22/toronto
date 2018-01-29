import stateSyncService from '../stateSyncService';
import graphTraversal from '../../../../common/state/graphTraversal';
import _ from 'lodash';
import StatePackager from '../../service/StatePackager';
import dancePartnerSynchronizer from '../../views/dancePartnerSynchronizer';
import dashboardIslandViewFactory from "../../views/DashboardIslandViewModelFactory";
import stateTraversal from "../../state/stateTraversal";

// NOTE: Deprecated. Do not use parallel dom anymore.
class ComponentService {

  constructor() {
    this.statePackager = new StatePackager();
  }

  delete(stateNew, stateOld, parentId, childId) {
    this.moveDeletedChildToEndOfArray(stateNew, parentId, childId);
    this.moveDeletedChildToEndOfArray(stateOld, parentId, childId);

    const appContainerModel = stateNew.model.appContainer;
    const parent = graphTraversal.find(appContainerModel, parentId);
    this.removeChildFromParent(parent, childId);

    const island = stateTraversal.findIslandWithId(stateNew, parentId);
    dashboardIslandViewFactory.syncModelToViewModel(stateNew, island);

    // const statePackage = this.statePackager.package(JSON.stringify(stateOld), JSON.stringify(stateNew));
    // return stateSyncService.saveState(statePackage);
  }

  removeChildFromParent(parent, childId) {
    const arrayRemoved = _.remove(parent.children, (child) => {
      return child.id === childId;
    });
    return arrayRemoved[0];
  }

  // Note: This simplifies our diffing algorithm later on. Without it delete diffs could get quite complex.
  // See deep-diff documentation on what happens with arrays.
  moveDeletedChildToEndOfArray(state, parentId, childId) {
    const parent = graphTraversal.find(state.model, parentId);
    const removed = this.removeChildFromParent(parent, childId);
    parent.children.push(removed);
  }

  update(stateNew, jsonStateOld, id, property, newValue) {
    const appContainerModel = stateNew.model.appContainer;

    const object = graphTraversal.find(appContainerModel, id);

    object[property] = newValue;

    const statePackage = this.statePackager.package(jsonStateOld, JSON.stringify(stateNew));
    return stateSyncService.saveState(statePackage);
  }

  stateInjector(parentModel, viewParentNode, component) {
    parentModel.children.push(component.model);

    if (component.dom !== null) {
      viewParentNode.children.push(component.dom);
    }
  }
}

export default ComponentService;
