import ComponentService from './componentService';
import StatePackager from '../statePackager';
import stateSyncService from '../stateSyncService';
import componentGenerator from '../../domain/component/componentGenerator';
import graphTraversal from '../../../js/state/graphTraversal';

class ContainerService extends ComponentService {

  constructor() {
    super();
    this.statePackager = new StatePackager();
    this.addModel = this.addModel.bind(this);
    this.updateModel = this.updateModel.bind(this);
    this.createOrUpdate = this.createOrUpdate.bind(this);
  }

  addModel(state, model) {
    const modelParentNode = graphTraversal.find(state.model, model.parentId);

    const component = componentGenerator.createComponent(model);
    const viewParentNode = graphTraversal.find(state.dom.view, model.parentId);

    this.stateInjector(modelParentNode, viewParentNode, component);
  }

  updateModel(state, model) {
    const modelNode = graphTraversal.find(state.model, model.id);
    Object.assign(modelNode, model);
  }

  createOrUpdate(stateNew, jsonStateOld, model) {
    if (model.id) {
      this.updateModel(stateNew, model);
    } else {
      this.addModel(stateNew, model);
    }

    const statePackage = this.statePackager.package(jsonStateOld, JSON.stringify(stateNew));
    return stateSyncService.saveState(statePackage);
  }
}

export default new ContainerService();
