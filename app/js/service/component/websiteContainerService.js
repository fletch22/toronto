import ComponentService from './componentService';
import StatePackager from '../statePackager';
import stateSyncService from '../stateSyncService';
import componentGenerator from '../../domain/component/componentGenerator';
import graphTraversal from '../../../js/state/graphTraversal';

class WebsiteContainerService extends ComponentService {

  constructor() {
    super();
    this.statePackager = new StatePackager();
  }

  addWebsiteToState(state, label, parentId) {
    const modelParentNode = graphTraversal.find(state.model.appContainer, parentId);

    const component = componentGenerator.createWebsite(parentId, label);
    const viewParentNode = graphTraversal.find(state.dom.view.appContainer, parentId);
    this.stateInjector(modelParentNode, viewParentNode, component);
  }

  addWebsite(stateNew, jsonStateOld, parentId, label) {
    this.addWebsiteToState(stateNew, parentId, label);

    const statePackage = this.statePackager.package(jsonStateOld, JSON.stringify(stateNew));
    return stateSyncService.saveStateSynchronous(statePackage);
  }

  addWebsiteAsync(stateNew, jsonStateOld, parentId, label) {
    this.addWebsiteToState(stateNew, label, parentId);

    const statePackage = this.statePackager.package(jsonStateOld, JSON.stringify(stateNew));
    return stateSyncService.saveState(statePackage);
  }
}

export default new WebsiteContainerService();
