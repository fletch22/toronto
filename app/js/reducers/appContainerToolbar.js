import { ACTIONS } from '../actions/index.js';
import defaultState from '../domain/defaultState';
import stateFixer from '../domain/stateFixer';

const appContainerToolbar = (state = defaultState, action) => {

  const stateNew = Object.assign({}, state);
  const appContainerModel = stateNew.model.appContainer;
  const appContainerDom = stateNew.dom.view.appContainer;

  switch (action.type) {
    case ACTIONS.types.ADD_APP: {
      const app = {
        parentId: appContainerModel.id,
        id: appContainerModel.children.length,
        label: appContainerDom.section.addNew.appLabel
      };

      appContainerModel.children.push(app);

      stateFixer.fix(stateNew);
      return stateNew;
    }
    case ACTIONS.types.APP_LABEL_INPUT_CHANGE: {
      appContainerDom.section.addNew.appLabel = action.appLabel;

      stateFixer.fix(stateNew);
      return stateNew;
    }
    case ACTIONS.types.SET_STATE: {
      return action.state;
    }
    default: {
      return state;
    }
  }
};

export default appContainerToolbar;
