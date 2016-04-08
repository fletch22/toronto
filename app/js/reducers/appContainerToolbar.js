import { ACTIONS } from '../actions/index.js';
import workerClient from '../worker/statePersisterWorkerClient';

const appContainerToolbar = (state = { apps: [] }, action) => {
  const stateNew = Object.assign({}, state);
  const appContainerModel = stateNew.model.appContainer;
  const appContainerDom = stateNew.dom.view.appContainer;

  switch (action.type) {
    case ACTIONS.types.ADD_APP: {
      const app = {
        parentId: appContainerModel.id,
        id: appContainerModel.children.length,
        label: appContainerDom.section.addNew.appLabel
      };

      appContainerModel.children.push(app);

      workerClient.persistState(stateNew);

      return stateNew;
    }
    case ACTIONS.types.APP_LABEL_INPUT_CHANGE: {
      appContainerDom.section.addNew.appLabel = action.appLabel;

      workerClient.persistState(stateNew);

      return stateNew;
    }
    default: {
      return state;
    }
  }
};

export default appContainerToolbar;
