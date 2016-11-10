import _ from 'lodash';
import dashboard from './dashboard';
import { ActionTypes as ModalActionTypes } from './modal';

export const ACTIONS = {
  types: {
    ADD_APP: 'ADD_APP',
    APP_LABEL_INPUT_CHANGE: 'APP_LABEL_INPUT_CHANGE',
    ENSURE_INTIAL_STATE_SAVED: 'ENSURE_INTIAL_STATE_SAVED',
    SET_STATE: 'SET_STATE',
    SET_STATE_AND_PERSIST: 'SET_STATE_AND_PERSIST',
    TIME_TRAVEL_TO_PREVIOUS_STATE: 'TIME_TRAVEL_TO_PREVIOUS_STATE',
    MODAL_ERROR_SHOW: 'MODAL_ERROR_SHOW',
    MODAL_HIDE_CURRENT: 'MODAL_HIDE_CURRENT',
    MODAL_STATE_ROLLBACK_SHOW: 'MODAL_STATE_ROLLBACK_SHOW',
    STATE_ROLLBACK_TO_STATE_ID: 'STATE_ROLLBACK_TO_STATE_ID',
    SHOW_TIME_TRAVEL_NAV_BAR: 'SHOW_TIME_TRAVEL_NAV_BAR',
    HIDE_TIME_TRAVEL_NAV_BAR: 'HIDE_TIME_TRAVEL_NAV_BAR',
    UPDATE_ORB_PROPERTY_NO_PERSIST: 'UPDATE_ORB_PROPERTY_NO_PERSIST',
    REFRESH_PAGE: 'REFRESH_PAGE',
    NUKE_AND_PAVE: 'NUKE_AND_PAVE'
  }
};
_.extend(ACTIONS.types, dashboard.ActionTypes);
_.extend(ACTIONS.types, ModalActionTypes);

export const actionChangeAppLabelInput = (appLabel) => {
  return {
    type: ACTIONS.types.APP_LABEL_INPUT_CHANGE,
    appLabel
  };
};

export const actionSetState = (state) => {
  return {
    type: ACTIONS.types.SET_STATE,
    state
  };
};

export const actionSetStateAndPersist = (state) => {
  return {
    type: ACTIONS.types.SET_STATE_AND_PERSIST,
    state
  };
};

export const actionShowStateRollbackModal = (rollbackPayload) => {
  return {
    type: ACTIONS.types.MODAL_STATE_ROLLBACK_SHOW,
    rollbackPayload
  };
};

export const actionShowErrorModal = (headerText, bodyText, okAction) => {
  return {
    type: ACTIONS.types.MODAL_ERROR_SHOW,
    headerText,
    bodyText,
    okAction
  };
};

export const actionHideCurrentModal = () => {
  return {
    type: ACTIONS.types.MODAL_HIDE_CURRENT
  };
};

export const actionRollbackToStateId = (rollbackPayload) => {
  return {
    type: ACTIONS.types.STATE_ROLLBACK_TO_STATE_ID,
    rollbackPayload
  };
};

export const actionShowTimeTravelNavBar = () => {
  return {
    type: ACTIONS.types.SHOW_TIME_TRAVEL_NAV_BAR
  };
};

export const actionHideTimeTravelNavBar = () => {
  return {
    type: ACTIONS.types.HIDE_TIME_TRAVEL_NAV_BAR
  };
};

export const actionEnsureInitialStateSaved = () => {
  return {
    type: ACTIONS.types.ENSURE_INTIAL_STATE_SAVED
  };
};

export const actionUpdateOrbPropertyNoPersist = (id, propertyName, value) => {
  return {
    type: ACTIONS.types.UPDATE_ORB_PROPERTY_NO_PERSIST,
    payload: { id, propertyName, value }
  };
};

export const actionRefreshPage = () => {
  return {
    type: ACTIONS.types.REFRESH_PAGE
  };
};

export const actionNukeAndPave = () => ({
  type: ACTIONS.types.NUKE_AND_PAVE
});

