import ComponentService from './componentService';
import StatePackager from '../statePackager';
import stateSyncService from '../stateSyncService';
import componentGenerator from '../../domain/component/componentGenerator';
import graphTraversal from '../../../js/state/graphTraversal';

class WebsiteContainerService extends ComponentService {

  constructor() {
    super();
    this.statePackager = new StatePackager();
    this.addWebsiteToModel = this.addWebsiteToModel.bind(this);
    this.updateWebsiteModel = this.updateWebsiteModel.bind(this);
    this.createOrUpdate = this.createOrUpdate.bind(this);
  }

  addWebsiteToModel(state, model) {
    const modelParentNode = graphTraversal.find(state.model.appContainer, model.parentId);

    const component = componentGenerator.createWebsite(model.parentId, model.label);
    const viewParentNode = graphTraversal.find(state.dom.view.appContainer, model.parentId);

    this.stateInjector(modelParentNode, viewParentNode, component);
  }

  updateWebsiteModel(state, model) {
    const modelNode = graphTraversal.find(state.model.appContainer, model.id);
    Object.assign(modelNode, model);
  }

  createOrUpdate(stateNew, jsonStateOld, model) {
    if (model.id) {
      this.updateWebsiteModel(stateNew, model);
    } else {
      this.addWebsiteToModel(stateNew, model);
    }

    const statePackage = this.statePackager.package(jsonStateOld, JSON.stringify(stateNew));
    return stateSyncService.saveState(statePackage);
  }
}

export default new WebsiteContainerService();
