import ComponentService from './componentService';
import StatePackager from '../StatePackager';
import stateSyncService from '../stateSyncService';
import componentGenerator from '../../domain/component/componentGeneratorDeprecated';
import graphTraversal from '../../../js/state/graphTraversal';
import dancePartnerSynchronizer from '../../views/dancePartnerSynchronizer';

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
    const viewParentNode = graphTraversal.find(state.dom.view, model.parentId);

    const component = componentGenerator.createComponent(model);

    this.stateInjector(modelParentNode, viewParentNode, component);

    return {
      component,
      modelParentNode,
      viewParentNode
    };
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

    dancePartnerSynchronizer.update(stateNew);

    const statePackage = this.statePackager.package(jsonStateOld, JSON.stringify(stateNew));
    return stateSyncService.saveState(statePackage);
  }
}

export default new ContainerService();
