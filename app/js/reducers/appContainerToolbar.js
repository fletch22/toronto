import { ACTIONS } from '../actions/index.js';
import stateFixer from '../domain/stateFixer';
import defaultState from '../state/defaultState';
import stateSyncService from '../service/stateSyncService';
import StatePackager from '../service/statePackager';
import ModelTransformer from '../stores/modelTransformer';
import uuid from 'node-uuid';

const appContainerToolbar = (state = defaultState.getInstance(), action) => {

  const statePackager = new StatePackager();
  const jsonStateOld = JSON.stringify(state);
  let stateNew = Object.assign({}, state);
  const appContainerModel = stateNew.model.appContainer;
  const appContainerDom = stateNew.dom.view.appContainer;

  switch (action.type) {
    case ACTIONS.types.ADD_APP: {
      const app = {
        parentId: appContainerModel.id,
        id: uuid.v1(),
        label: appContainerDom.section.addNew.appLabel,
        typeLabel: 'App'
      };

      appContainerModel.children.push(app);

      console.log(JSON.stringify(jsonStateOld));

      const statePackage = statePackager.package(jsonStateOld, JSON.stringify(stateNew));
      stateNew = stateSyncService.saveStateSynchronous(statePackage);

      //const modelTransformer = new ModelTransformer();
      //stateNew.model = modelTransformer.transform(JSON.parse(jsonAppContainer));

      console.log(stateNew);

      return JSON.parse(stateNew);
    }
    case ACTIONS.types.APP_LABEL_INPUT_CHANGE: {

      appContainerDom.section.addNew.appLabel = action.appLabel;

      stateFixer.fix(jsonStateOld, JSON.stringify(stateNew));
      return stateNew;
    }
    case ACTIONS.types.SET_STATE: {
      return action.state;
    }
    case ACTIONS.types.SHOW_STANDARD_MODAL: {
      stateNew.dom.standardModal.push(action.payload);

      return stateNew;
    }
    case ACTIONS.types.HIDE_STANDARD_MODAL: {
      stateNew.dom.standardModal.shift();

      return stateNew;
    }
    default: {
      return state;
    }
  }
};

export default appContainerToolbar;
