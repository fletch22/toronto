import { ACTIONS, actionRollbackToStateId } from '../actions/index.js';
import stateFixer from '../domain/stateFixer';
import defaultState from '../state/defaultState';
import appContainerService from '../service/component/appContainerService';
import { ErrorModalDtoFactory } from '../component/modals/ErrorModal';
import stateSyncService from '../service/stateSyncService';

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
    case ACTIONS.types.SET_STATE_AND_PERSIST: {
      stateFixer.fix(jsonStateOld, JSON.stringify(action.state));

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
      const errorModalDtoFactory = new ErrorModalDtoFactory();

      const okAction = actionRollbackToStateId(action.rollbackPayload);

      const errorModal = errorModalDtoFactory.getInstance('Error Saving State', 'The system encountered an error saving a previous state. ' +
        'When you click \'OK\' we will rollback the system to the last known good state.', okAction);

      stateNew.dom.modal.push(errorModal);

      return stateNew;
    }
    case ACTIONS.types.STATE_ROLLBACK_TO_STATEID: {
      const rollback = action.rollbackPayload;

      stateSyncService.rollbackToStateId(rollback.clientId);

      return rollback.state;
    }
    case ACTIONS.types.MODAL_HIDE_CURRENT: {
      stateNew.dom.modal.shift();
      stateFixer.fix(jsonStateOld, JSON.stringify(stateNew));

      return stateNew;
    }
    case ACTIONS.types.MODAL_ERROR_SHOW: {
      const errorModalDtoFactory = new ErrorModalDtoFactory();
      const errorModal = errorModalDtoFactory.getInstance(action.headerText, action.bodyText, action.okAction);

      stateNew.dom.modal.push(errorModal);

      return stateNew;
    }
    default: {
      return state;
    }
  }
};

export default appContainerToolbar;
