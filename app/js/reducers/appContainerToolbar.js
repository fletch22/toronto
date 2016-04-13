import { ACTIONS } from '../actions/index.js';
import workerClient from '../worker/statePersisterWorkerClient';
import defaultState from '../domain/defaultState';
import stateSyncService from '../service/stateSyncService';

const fixState = (state) => {
  // Put a pause workerClient here.
  workerClient.pausePersister();

  // Need checker to see if we need to rollback

  throw "Need index checker to see if we need to rollback!@!@!!!!!!";

  // Add flush here to clean out persister queue.

  throw "Need flush here!@!@!!!!!!";

  workerClient.persistState(state);
  const promise = stateSyncService.rollbackToTransaction(1234);

  promise.then(() => {
    // Unpause worker client here.
    workerClient.unpausePersister();
  });
  promise.catch((error) => {
    console.log(error);
    workerClient.unpausePersister();
  });
};

const appContainerToolbar = (state = defaultState, action) => {

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

      fixState(stateNew);
      return stateNew;
    }
    case ACTIONS.types.APP_LABEL_INPUT_CHANGE: {
      appContainerDom.section.addNew.appLabel = action.appLabel;

      fixState(stateNew);

      return stateNew;
    }
    case ACTIONS.types.SET_STATE: {
      return action.state;
    }
    default: {
      return state;
    }
  }
};

export default appContainerToolbar;
