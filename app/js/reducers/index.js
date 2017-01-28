import _ from 'lodash';
import { ACTIONS, actionRollbackToStateId } from '../actions/index.js';
import stateFixer from '../domain/stateFixer';
import defaultState from '../state/defaultState';
import appContainerService from '../service/component/appContainerService';
import ErrorModalDtoFactory from '../component/modals/ErrorModalDtoFactory';
import modalDtoFactory from '../component/modals/ModalDtoFactory';
import stateSyncService from '../service/stateSyncService';
import graphTraversal from '../state/graphTraversal';
import ModalTypes from '../component/modals/ModalTypes';
import restService from '../service/restService';
import actionComponentCreator from './actionComponentCreator';
import LayoutTranslator from '../component/bodyChildren/LayoutTranslator';

const reducer = (state = defaultState.getInstance(), action) => {
  const jsonStateOld = JSON.stringify(state);
  const stateNew = Object.assign({}, state);
  const appContainerDom = stateNew.dom.view.appContainer;

  switch (action.type) {
    case ACTIONS.types.DASHBOARD.APP.TOGGLE_HEADER_MENU: {
      const node = graphTraversal.find(appContainerDom, action.modelId);

      if (!node) {
        console.log(`State:  ${JSON.stringify(state)}`);
        console.error('Could not find node to toggle header menu.');
        return state;
      }

      node.isShowingHeaderMenu = !node.isShowingHeaderMenu;

      stateFixer.fix(jsonStateOld, JSON.stringify(stateNew));
      return stateNew;
    }
    case ACTIONS.types.DASHBOARD.BODY_CHILDREN.ACTION_PROCESS_ROOT_LAYOUT: {
      const model = graphTraversal.find(stateNew.model, action.payload.pageId);

      if (!model) {
        console.log(`State:  ${JSON.stringify(action.payload.pageId)}`);
        return state;
      }

      LayoutTranslator.translate(model, action.payload.layout);

      return stateNew;
    }
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
    case ACTIONS.types.MODAL.MODAL_CONFIRM_SHOW: {
      const modal = {
        modalType: ModalTypes.ConfirmModal,
        headerText: action.headerText,
        bodyText: action.bodyText,
        yesAction: action.yesAction,
        noAction: action.noAction,
        cancelAction: action.cancelAction
      };

      stateNew.dom.modal.push(modal);

      return stateNew;
    }
    case ACTIONS.types.MODAL.MODAL_PSEUDO_SHOW: {
      const viewData = modalDtoFactory.getPseudoModalInstance({
        componentViewName: action.componentViewName,
        data: action.payload
      });

      stateNew.dom.pseudoModals.push(viewData);

      stateFixer.fix(jsonStateOld, JSON.stringify(stateNew));

      return stateNew;
    }
    case ACTIONS.types.MODAL.MODAL_PSEUDO_FORGET: {
      _.remove(stateNew.dom.pseudoModals, _.matches({ id: action.payload.id }));

      stateFixer.fix(jsonStateOld, JSON.stringify(stateNew));

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
    case ACTIONS.types.STATE_ROLLBACK_TO_STATE_ID: {
      const rollback = action.rollbackPayload;

      const promise = stateSyncService.rollbackToStateId(rollback.clientId);
      promise.then(() => {
        stateFixer.resetStatePersister();
      });

      return rollback.state;
    }
    case ACTIONS.types.MODAL_HIDE: {
      _.remove(stateNew.dom.modal, {
        id: action.id
      });
      stateFixer.fix(jsonStateOld, JSON.stringify(stateNew));

      return stateNew;
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
    case ACTIONS.types.SHOW_TIME_TRAVEL_NAV_BAR: {
      stateNew.dom.view.timeTravelNavBar.show = true;
      window.showTimeTravelNavBar = true;

      return stateNew;
    }
    case ACTIONS.types.HIDE_TIME_TRAVEL_NAV_BAR: {
      stateNew.dom.view.timeTravelNavBar.show = false;
      window.showTimeTravelNavBar = false;

      return stateNew;
    }
    case ACTIONS.types.ENSURE_INTIAL_STATE_SAVED: {
      if (!stateNew.hasInitialStateBeenSaved) {
        console.debug('Saving initial state in reducer ...');
        stateNew.hasInitialStateBeenSaved = true;
        stateFixer.fix(jsonStateOld, JSON.stringify(stateNew));
      }
      return stateNew;
    }
    case ACTIONS.types.REFRESH_PAGE: {
      document.location.href = document.location.href;
      break;
    }
    case ACTIONS.types.NUKE_AND_PAVE: {
      restService.nukeAndPave()
        .then(() => {
          window.document.location.href = window.document.location.href;
        })
        .catch((error) => {
          console.error(error);
        });
      break;
    }
    case ACTIONS.types.UPDATE_ORB_PROPERTY_NO_PERSIST: {
      const appContainerModel = stateNew.model.appContainer;
      const object = graphTraversal.find(appContainerModel, action.payload.id);

      object[action.payload.propertyName] = action.payload.value;

      return stateNew;
    }
    case ACTIONS.types.UPDATE_VIEW_PROPERTY_VALUE: {
      const payload = action.payload;
      let node = graphTraversal.find(stateNew, payload.viewId);

      let propertyName;
      const path = payload.path.split('.');
      if (path.length > 1) {
        propertyName = path.splice(-1, 1);
        path.forEach((prop) => {
          node = node[prop];
        });
      } else {
        propertyName = path;
      }

      node[propertyName] = payload.propertyValue;

      if (payload.needsPersisting) {
        stateFixer.fix(jsonStateOld, JSON.stringify(stateNew));
      }

      return stateNew;
    }
    case ACTIONS.types.CREATE_BODY_COMPONENT: {
      actionComponentCreator.generatePageChildComponent(stateNew, action);
      return stateNew;
    }
    case ACTIONS.types.CREATE_PSEUDO_MODAL_COMPONENT: {
      const component = actionComponentCreator.createComponentEditorData(stateNew, action);

      const viewData = modalDtoFactory.getPseudoModalInstance(component);

      stateNew.dom.pseudoModals.push(viewData);

      stateFixer.fix(jsonStateOld, JSON.stringify(stateNew));

      return stateNew;
    }
    // TODO: Needs a test.
    case ACTIONS.types.SET_CURRENT_BODY_CHILD_TOOL: {
      const viewModelId = action.payload.viewModelId;

      const viewModel = graphTraversal.find(stateNew, viewModelId);
      viewModel.isSelected = true;

      c.lo(viewModel, 'reducer after set...');

      let pageViewNode = viewModel;
      let parentNodeId = viewModel.parentId;
      while (parentNodeId !== actionComponentCreator.WEB_PAGE_ROOT) {
        c.l('here we go...');
        const parentNode = graphTraversal.find(stateNew, parentNodeId);
        if (!parentNode) {
          throw new Error('Encountered problem trying to find web page root node.');
        }
        parentNodeId = parentNode.parentId;
        pageViewNode = parentNode;
      }

      if (pageViewNode.selectedChildViewId) {
        const currentlySelectedViewModel = graphTraversal.find(stateNew, pageViewNode.selectedChildViewId);
        currentlySelectedViewModel.isSelected = false;
      }
      pageViewNode.selectedChildViewId = viewModelId;

      // c.lo(viewModel, 'reducer: ');
      return stateNew;
    }
    // TODO: Needs a test.
    case ACTIONS.types.SET_CURRENT_BODY_CHILD_TO_PARENT_TOOL: {
      const viewModelId = action.payload.viewModelId;

      let pageViewNode;
      const parentViewModel = graphTraversal.findParent(stateNew, viewModelId);
      const intendedSelectedViewModel = graphTraversal.find(stateNew, viewModelId);
      intendedSelectedViewModel.isSelected = true;
      c.lo(intendedSelectedViewModel, 'reducer: ');

      pageViewNode = parentViewModel;
      let parentId = pageViewNode.parentId;
      while (parentId !== actionComponentCreator.WEB_PAGE_ROOT) {
        c.l('here we go...');
        const parentNode = graphTraversal.find(stateNew, parentId);
        if (!parentNode) {
          throw new Error('Encountered problem trying to find web page root node.');
        }
        parentId = parentNode.parentId;
        pageViewNode = parentNode;
      }

      if (pageViewNode.selectedChildViewId) {
        const viewModelCurrentlySelected = graphTraversal.findParent(stateNew, pageViewNode.selectedChildViewId);
        // c.lo(viewModelCurrentlySelected, 'Before setting...');
        viewModelCurrentlySelected.isSelected = false;
        // c.lo(viewModelCurrentlySelected, 'After setting...');
      }

      pageViewNode.selectedChildViewId = viewModelId;


      return stateNew;
    }
    default: {
      return state;
    }
  }
};

export default reducer;
