export const ACTIONS = {
  types: {
    ADD_APP: 'ADD_APP',
    APP_LABEL_INPUT_CHANGE: 'APP_LABEL_INPUT_CHANGE',
    SET_STATE: 'SET_STATE',
    SHOW_STANDARD_MODAL: 'SHOW_OVERLAY',
    HIDE_STANDARD_MODAL: 'HIDE_OVERLAY'
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

export const showStandardModal = (showModal, headerText) => {
  return {
    type: ACTIONS.types.SHOW_STANDARD_MODAL,
    payload: {
      showModal,
      headerText
    }
  };
};

export const hideStandardModal = () => {
  return {
    type: ACTIONS.types.HIDE_STANDARD_MODAL
  };
};

