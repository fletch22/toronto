import ComponentService from './componentService';
import StatePackager from '../StatePackager';
import stateSyncService from '../stateSyncService';
import graphTraversal from '../../../js/state/graphTraversal';
import LayoutModelFactory from '../../domain/component/layoutModelFactory';

class LayoutService extends ComponentService {

  constructor() {
    super();
    this.statePackager = new StatePackager();
    this.addModel = this.addModel.bind(this);
    this.updateModel = this.updateModel.bind(this);
    this.createOrUpdate = this.createOrUpdate.bind(this);
  }

  addModel(state, protoModel) {
    const modelParentNode = graphTraversal.find(state.model, protoModel.parentId);

    const model = LayoutModelFactory.createInstance(protoModel);

    modelParentNode.children.push(model);

    return model;
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

export default new LayoutService();
