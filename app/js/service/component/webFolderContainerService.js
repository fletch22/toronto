import ComponentService from './componentService';
import StatePackager from '../statePackager';
import stateSyncService from '../stateSyncService';
import componentGenerator from '../../domain/component/componentGenerator';
import graphTraversal from '../../../js/state/graphTraversal';

class WebsiteContainerService extends ComponentService {

  constructor() {
    super();
    this.statePackager = new StatePackager();
    this.addToModel = this.addToModel.bind(this);
    this.updateModel = this.updateModel.bind(this);
    this.createOrUpdate = this.createOrUpdate.bind(this);
  }

  addToModel(state, model) {
    const modelParentNode = graphTraversal.find(state.model.appContainer, model.parentId);

    const component = componentGenerator.createWebsite(model.parentId, model.label);
    const viewParentNode = graphTraversal.find(state.dom.view.appContainer, model.parentId);

    this.stateInjector(modelParentNode, viewParentNode, component);
  }

  updateModel(state, model) {
    const modelNode = graphTraversal.find(state.model.appContainer, model.id);
    Object.assign(modelNode, model);
  }

  createOrUpdate(stateNew, jsonStateOld, model) {
    if (model.id) {
      this.updateModel(stateNew, model);
    } else {
      this.addToModel(stateNew, model);
    }

    const statePackage = this.statePackager.package(jsonStateOld, JSON.stringify(stateNew));
    return stateSyncService.saveState(statePackage);
  }
}

export default new WebsiteContainerService();
