export const ACTIONS = {
  types: {
    ADD_APP: 'ADD_APP',
    APP_LABEL_INPUT_CHANGE: 'APP_LABEL_INPUT_CHANGE',
    SET_STATE: 'SET_STATE',
    SHOW_OVERLAY: 'SHOW_OVERLAY'
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

export const showModalOverlay = (isShowModalOverlay, headerText) => {
  return {
    type: ACTIONS.types.SHOW_OVERLAY,
    payload: {
      isShowModalOverlay,
      headerText
    }
  };
};

export const showModalOverlayNew = (isShowModalOverlay, headerText) => {
  return {
    type: ACTIONS.types.SHOW_OVERLAY,
    payload: {
      isShowModalOverlay,
      headerText
    }
  };
};


