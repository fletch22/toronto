import defaultState from './../state/defaultState';
import ModelToStateGenerator from './ModelToStateGenerator';

// Deprecated: Use ModelToStateGenerator instead.
class ModelToStateTransformer {

  transform(appContainerModel, serverStartupTimestamp) {
    const state = Object.assign({}, defaultState.getInstance());

    const modelToStateGenerator = new ModelToStateGenerator(state);
    modelToStateGenerator.process(appContainerModel);
    state.serverStartupTimestamp = serverStartupTimestamp;

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
