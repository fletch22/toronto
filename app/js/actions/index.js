export const ACTIONS = {
  types: {
    ADD_APP: 'ADD_APP',
    APP_LABEL_INPUT_CHANGE: 'APP_LABEL_INPUT_CHANGE',
    SET_STATE: 'SET_STATE',
    SHOW_STANDARD_MODAL: 'SHOW_OVERLAY',
    HIDE_STANDARD_MODAL: 'HIDE_OVERLAY',
    TIME_TRAVEL_TO_PREVIOUS_STATE: 'TIME_TRAVEL_TO_PREVIOUS_STATE',
    MODAL_STATE_ROLLBACK_HIDE: 'MODAL_STATE_ROLLBACK_HIDE',
    MODAL_STATE_ROLLBACK_SHOW: 'MODAL_STATE_ROLLBACK_SHOW'
  }
};

export const addApp = () => {
  return {
    type: ACTIONS.types.ADD_APP
  };
};

export const appLabelOnChange = (appLabel) => {
  return {
    type: ACTIONS.types.APP_LABEL_INPUT_CHANGE,
    appLabel
  };
};

export const setState = (state) => {
  return {
    type: ACTIONS.types.SET_STATE,
    state
  };
};

export const showStandardModal = (showModal, headerText, okAction) => {
  return {
    type: ACTIONS.types.SHOW_STANDARD_MODAL,
    payload: {
      showModal,
      headerText,
      okAction
    }
  };
};

export const timeTravelToPreviousState = (stateId) => {
  return {
    type: ACTIONS.types.TIME_TRAVEL_TO_PREVIOUS_STATE,
    stateId
  };
};

export const hideStandardModal = () => {
  return {
    type: ACTIONS.types.HIDE_STANDARD_MODAL
  };
};

export const stateRollbackModalShow = (stateId) => {
  return {
    type: ACTIONS.types.MODAL_STATE_ROLLBACK_SHOW,
    stateId: stateId
  };
};

export const hideStateRollbackModal = () => {
  return {
    type: ACTIONS.types.MODAL_STATE_ROLLBACK_HIDE
  };
};



