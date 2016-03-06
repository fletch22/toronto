import { ACTIONS } from '../actions/index.js';

const apps = (state = { apps: [] }, action) => {
  const stateNew = Object.assign({}, state);
  switch (action.type) {
    case ACTIONS.types.ADD_APP: {
      const app = {
        id: stateNew.children.length,
        label: stateNew.appLabel
      };

      stateNew.children.push(app);

      return stateNew;
    }
    case ACTIONS.types.APP_LABEL_INPUT_CHANGE: {
      stateNew.appLabel = action.appLabel;

      return stateNew;
    }
    default: {
      return state;
    }
  }
};

export default apps;
