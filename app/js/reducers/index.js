import _ from 'lodash';
import { ACTIONS, actionRollbackToStateId } from '../actions/index.js';
import stateFixer from '../domain/stateFixer';
import defaultState from '../state/defaultState';
import appContainerService from '../service/component/appContainerService';
import ErrorModalDtoFactory from '../component/modals/ErrorModalDtoFactory';
import standardModalDtoFactory from '../component/modals/StandardModalDtoFactory';
import modalDtoFactory from '../component/modals/ModalDtoFactory';
import stateSyncService from '../service/stateSyncService';
import graphTraversal from '../state/graphTraversal';
import ModalTypes from '../component/modals/ModalTypes';
import restService from '../service/restService';
import actionComponentCreator from './viewModelFactory';
import actionBodyChildSelectorHandler from './actionBodyChildSelectorHandler';
import actionBodyChildSetPropertyHandler from './actionBodyChildSetPropertyHandler';
import actionPseudoModalEditorCreator from './actionPseudoModalEditorCreator';
import dashboardIslandViewFactory from '../views/DashboardIslandViewModelFactory';
import viewUtils from '../views/viewUtils';
import ViewTypes from '../views/ViewTypes';

const reducer = (state = defaultState.getInstance(), action) => {
  const jsonStateOld = JSON.stringify(state);
  const stateNew = Object.assign({}, state);
  const appContainerDom = stateNew.dom.view.appContainer;

  switch (action.type) {
    case ACTIONS.types.DASHBOARD.APP.TOGGLE_HEADER_MENU: {
      const node = graphTraversal.find(appContainerDom, action.modelId);

      if (!node) {
        console.error('Could not find node to toggle header menu.');
        return state;
      }

      node.isShowingHeaderMenu = !node.isShowingHeaderMenu;

      stateFixer.fix(jsonStateOld, JSON.stringify(stateNew));
      return stateNew;
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
    case ACTIONS.types.MODAL_STANDARD_SHOW: {
      const modal = standardModalDtoFactory.getInstance(action.headerText, action.bodyText, action.okAction);

      stateNew.dom.modal.push(modal);

      return stateNew;
    }
    case ACTIONS.types.MODAL_ERROR_SHOW: {
      const errorModalDtoFactory = new ErrorModalDtoFactory();
      const errorModal = errorModalDtoFactory.getInstance(action.headerText, action.bodyText, action.okAction);

      c.lo(errorModal, 'red errorModal: ');

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
    case ACTIONS.types.INITIALIZE_F22_APP: {
      if (!stateNew.hasInitialStateBeenSaved) {
        stateNew.hasInitialStateBeenSaved = true;
        stateFixer.fix(jsonStateOld, JSON.stringify(stateNew));
      }

      if (stateNew.model.appContainer.id !== -1) {
        viewUtils.removeAllViewsByType(ViewTypes.Dashboard.Island, stateNew);
        const islandView = dashboardIslandViewFactory.createInstance(stateNew.model.appContainer);
        stateNew.views.push(islandView);
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
    case ACTIONS.types.RESTORE_FROM_DISK: {
      restService.restoreFromDisk()
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
    case ACTIONS.types.UPDATE_PROPERTY_NO_PERSIST: {
      const object = graphTraversal.find(stateNew, action.payload.uuid);

      object[action.payload.propertyName] = action.payload.value;

      return stateNew;
    }
    case ACTIONS.types.UPDATE_PROPERTY_WITH_PERSIST: {
      const object = graphTraversal.find(stateNew, action.payload.uuid);

      object[action.payload.propertyName] = action.payload.value;

      stateFixer.fix(jsonStateOld, JSON.stringify(stateNew));

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
    case ACTIONS.types.CREATE_PSEUDO_MODAL_COMPONENT: {
      const component = actionPseudoModalEditorCreator.create(stateNew, action);

      const viewData = modalDtoFactory.getPseudoModalInstance(component);

      stateNew.dom.pseudoModals.push(viewData);

      stateFixer.fix(jsonStateOld, JSON.stringify(stateNew));

      return stateNew;
    }
    case ACTIONS.types.CREATE_PSEUDO_MODAL: {
      const payload = action.payload;

      const viewModel = actionComponentCreator.getPseudoModalData(payload.pseudoModalTypes, state, payload.modelNodeId);

      let viewData = modalDtoFactory.getPseudoModalInstance(viewModel);

      viewData = JSON.parse(JSON.stringify(viewData));

      stateNew.dom.pseudoModals.push(viewData);

      stateFixer.fix(jsonStateOld, JSON.stringify(stateNew));

      return stateNew;
    }
    case ACTIONS.types.SET_CURRENT_BODY_CHILD_TOOL: {
      const intendedSelectedViewModelId = action.payload.viewModelId;

      return actionBodyChildSelectorHandler.process(stateNew, intendedSelectedViewModelId);
    }
    case ACTIONS.types.SET_CURRENT_BODY_CHILD_TO_PARENT_TOOL: {
      const childViewModelId = action.payload.viewModelId;
      const intendedSelectedViewModel = graphTraversal.findParent(stateNew, childViewModelId);

      if (intendedSelectedViewModel) {
        return actionBodyChildSelectorHandler.process(stateNew, intendedSelectedViewModel.id);
      }
      return state;
    }
    case ACTIONS.types.TOGGLE_MINION_STATIC_LOCK: {
      const selectedViewModelId = action.payload.selectedViewModelId;

      const layoutViewModel = graphTraversal.find(stateNew, selectedViewModelId);
      layoutViewModel.isStatic = !layoutViewModel.isStatic;

      stateFixer.fix(jsonStateOld, JSON.stringify(stateNew));

      return stateNew;
    }
    // Deprecated
    case ACTIONS.types.TOGGLE_LAYOUT_MINION_BORDERS: {
      const selectedViewId = action.payload.viewId;
      const parent = graphTraversal.findParent(stateNew, selectedViewId);
      const layoutViewModel = graphTraversal.find(parent, selectedViewId);
      layoutViewModel.areMinionBordersVisible = !layoutViewModel.areMinionBordersVisible;

      let borderStyle = '';
      if (layoutViewModel.areMinionBordersVisible) {
        borderStyle = '1px dashed red';
      }

      actionBodyChildSetPropertyHandler.setStyleOnAllChildren(layoutViewModel, 'outline', borderStyle);

      stateFixer.fix(jsonStateOld, JSON.stringify(stateNew));

      return stateNew;
    }
    case ACTIONS.types.WIZARD.SLIDE_RIGHT: {
      const id = action.payload.id;

      const carousel = graphTraversal.find(stateNew, id);
      c.lo(carousel, 'carousel right before setting: ');
      carousel.activeIndex += 1;
      c.lo(carousel, 'carousel right: ');

      stateFixer.fix(jsonStateOld, JSON.stringify(stateNew));

      return stateNew;
    }
    case ACTIONS.types.WIZARD.SLIDE_LEFT: {
      const id = action.payload.id;

      const carousel = graphTraversal.find(stateNew, id);

      if (carousel.activeIndex > 0) {
        carousel.activeIndex -= 1;
      }

      stateFixer.fix(jsonStateOld, JSON.stringify(stateNew));

      return stateNew;
    }
    case ACTIONS.types.WIZARD.SLIDE_TO_INDEX: {
      const payload = action.payload;
      const id = payload.id;
      const index = payload.activeIndex;

      const carousel = graphTraversal.find(stateNew, id);
      carousel.activeIndex = index;

      stateFixer.fix(jsonStateOld, JSON.stringify(stateNew));

      return stateNew;
    }
    case ACTIONS.types.WIZARD.CONFIGURE_DDL.SELECT_COLLECTION.TOGGLE_NEW_COLLECTION_NAME_INPUT: {
      const payload = action.payload;

      const input = graphTraversal.find(stateNew, payload.uuid);
      input.visible = !input.visible;

      return stateNew;
    }
    default: {
      return state;
    }
  }
};

export default reducer;
