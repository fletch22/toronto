import { ACTIONS } from '../actions/index.js';
import stateFixer from '../domain/stateFixer';
import defaultState from '../state/defaultState';

const appContainerToolbar = (state = defaultState.getInstance(), action) => {

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

      stateFixer.fix(state, stateNew);
      return stateNew;
    }
    case ACTIONS.types.APP_LABEL_INPUT_CHANGE: {
      appContainerDom.section.addNew.appLabel = action.appLabel;

      stateFixer.fix(state, stateNew);
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
    default: {
      return state;
    }
  }
};

export default appContainerToolbar;
