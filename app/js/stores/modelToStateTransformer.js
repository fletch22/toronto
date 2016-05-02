import defaultState from './../state/defaultState';
import ModelTransformer from './modelTransformer';

class ModelToStateTransformer {

  transform(appContainerModel) {

    const modelTransformer = new ModelTransformer();
    const state = Object.assign({}, defaultState.getInstance());
    state.model = modelTransformer.transform(appContainerModel);

    return state;
  }

  isValid(model) {
    let result = false;
    if (model.parentId === 0 // NOTE: Little bit leaky abstraction here.
    && model.children.haveChildrenBeenResolved) {
      result = true;
    }

    return result;
  }
}

export default ModelToStateTransformer;
