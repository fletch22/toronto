export const ACTIONS = {
  types: {
    ADD_APP: 'ADD_APP',
    APP_LABEL_INPUT_CHANGE: 'APP_LABEL_INPUT_CHANGE',
    SET_STATE: 'SET_STATE'
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

