import { ACTIONS } from '../actions/index.js';
import stateFixer from '../domain/stateFixer';
import defaultState from '../state/defaultState';
import stateSyncService from '../service/stateSyncService';
import StatePackager from '../service/statePackager';
import ModelTransformer from '../stores/modelTransformer';
import uuid from 'node-uuid';
import appContainerService from '../service/component/appContainerService';

const appContainerToolbar = (state = defaultState.getInstance(), action) => {

  const jsonStateOld = JSON.stringify(state);
  const stateNew = Object.assign({}, state);
  const appContainerDom = stateNew.dom.view.appContainer;

  switch (action.type) {
    case ACTIONS.types.ADD_APP: {
      return appContainerService.addApp(state, jsonStateOld, appContainerDom.section.addNew.appLabel);
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
    case ACTIONS.types.MODAL_STATE_ROLLBACK_HIDE: {
      stateNew.dom.modal.stateRollback.showModal = false;
      stateNew.dom.modal.stateRollback.stateId = '';

      return stateNew;
    }
    case ACTIONS.types.MODAL_STATE_ROLLBACK_SHOW: {
      stateNew.dom.modal.stateRollback.showModal = true;
      stateNew.dom.modal.stateRollback.stateId = action.stateId;

      return stateNew;
    }
    default: {
      return state;
    }
  }
};

export default appContainerToolbar;
