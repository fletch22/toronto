import ComponentService from './componentService';
import StatePackager from '../statePackager';
import stateSyncService from '../stateSyncService';
import componentGenerator from '../../domain/component/componentGenerator';
import graphTraversal from '../../../js/state/graphTraversal';

class SuperLocalComponentService extends ComponentService {

  constructor() {
    super();
    this.statePackager = new StatePackager();
    this.add = this.add.bind(this);
    this.update = this.update.bind(this);
    this.createOrUpdate = this.createOrUpdate.bind(this);
  }

  add(state, model, viewId) {
    const modelParentNode = graphTraversal.find(state.model, model.parentId);

    const view = graphTraversal.find(state, viewId);

    const viewParentNode = graphTraversal.find(state.dom.view, model.parentId);

    const component = componentGenerator.createComponent(model);

    this.stateInjector(modelParentNode, viewParentNode, component);

    return {
      component,
      modelParentNode,
      viewParentNode
    };
  }

  update(state, model) {
    const modelNode = graphTraversal.find(state.model, model.id);
    Object.assign(modelNode, model);

    // NOTE: This should be remove after we know fore sure that we will not need a deep-sh copy of the model (child replacement).
    // modelNode.children = [];
    // const customizer = (objValue, srcValue) => {
    //   if (_.isArray(objValue)) {
    //     console.log('concatting array.');
    //     return objValue.concat(srcValue);
    //   }
    // };
    // _.mergeWith(modelNode, model, customizer);
  }

  createOrUpdate(stateNew, jsonStateOld, model, viewId) {
    if (model.id) {
      this.update(stateNew, model, viewId);
    } else {
      this.add(stateNew, model, viewId);
    }

    const statePackage = this.statePackager.package(jsonStateOld, JSON.stringify(stateNew));
    return stateSyncService.saveState(statePackage);
  }
}

export default new SuperLocalComponentService();
