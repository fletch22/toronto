export const ACTIONS = {
  types: {
    ADD_APP: 'ADD_APP',
    APP_LABEL_INPUT_CHANGE: 'APP_LABEL_INPUT_CHANGE'
  }
};

export const addApp = (app) => {
  return {
    type: ACTIONS.types.ADD_APP,
    app
  };
};

export const appLabelOnChange = (appLabel) => {
  return {
    type: ACTIONS.types.APP_LABEL_INPUT_CHANGE,
    appLabel
  };
};

