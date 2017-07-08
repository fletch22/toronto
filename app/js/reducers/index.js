import _ from 'lodash';
import { ACTIONS, actionRollbackToStateId } from '../actions/index.js';
import stateFixer from '../domain/stateFixer';
import defaultState from '../state/defaultState';
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
import ConfigureDdlWizardViewFactory from '../component/bodyChildren/dropDownListbox/wizard/configure/ConfigureDdlWizardViewFactory';

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
      window.document.location.reload();
      break;
    }
    case ACTIONS.types.NUKE_AND_PAVE: {
      restService.nukeAndPave()
        .then(() => {
          window.document.location.reload();
        })
        .catch((error) => {
          console.error(error);
        });
      break;
    }
    case ACTIONS.types.RESTORE_FROM_DISK: {
      c.l('Got signal to restore from disk.');
      restService.restoreFromDisk()
        .then(() => {
          window.document.location.reload();
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

      const viewModel = actionComponentCreator.getPseudoModalData(payload.pseudoModalTypes, state, payload.viewId);

      let viewData = modalDtoFactory.getPseudoModalInstance(viewModel);
      viewData = _.cloneDeep(viewData);

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
      carousel.activeIndex += 1;

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
    case ACTIONS.types.WIZARD.ConfigureDdl.SelectCollectionSlide.TOGGLE_NEW_COLLECTION_NAME_INPUT: {
      const payload = action.payload;

      const input = graphTraversal.find(stateNew, payload.uuid);
      input.visible = !input.visible;

      stateFixer.fix(jsonStateOld, JSON.stringify(stateNew));

      return stateNew;
    }
    case ACTIONS.types.WIZARD.ConfigureDdl.SelectCollectionSlide.SELECT_DATA_MODEL: {
      const payload = action.payload;

      const viewModelWizard = graphTraversal.find(stateNew, payload.wizardId);

      viewModelWizard.dataModelId = payload.selectedDataModelId;
      viewModelWizard.dataModelLabel = payload.selectedDataModelLabel;

      const collections = viewModelWizard.viewModel.viewModel.children;
      const collection = _.find(collections, (coll) => {
        return coll.viewModel.id === viewModelWizard.dataModelId;
      });

      // When a collection is selected, reset some dependent values if necessary
      // TODO: 07-08-2017: These are broken. They will always be false.
      const fields = collection.viewModel.children;
      if (!fields.includes(viewModelWizard.selectedValueFieldId)) {
        viewModelWizard.selectedValueFieldId = null;
      }
      // TODO: 07-08-2017: These are broken. They will always be false.
      if (!fields.includes(viewModelWizard.selectedTextFieldId)) {
        viewModelWizard.selectedValueFieldId = null;
      }

      stateFixer.fix(jsonStateOld, JSON.stringify(stateNew));

      return stateNew;
    }
    case ACTIONS.types.WIZARD.ConfigureDdl.SelectDataStoreSlide.SELECT_DATA_STORE: {
      const payload = action.payload;

      const viewModelWizard = graphTraversal.find(stateNew, payload.wizardId);

      let dataStoreChanged = false;
      if (viewModelWizard.dataStoreId !== payload.selectedDataStoreId) {
        dataStoreChanged = true;
      }
      viewModelWizard.dataStoreId = payload.selectedDataStoreId;
      viewModelWizard.dataStoreLabel = payload.selectedDataStoreLabel;

      if (dataStoreChanged) {
        viewModelWizard.dataModelId = null;
        viewModelWizard.dataModelLabel = null;
        viewModelWizard.dataTextId = null;
        viewModelWizard.dataTextLabel = null;
        viewModelWizard.dataValueId = null;
        viewModelWizard.dataValueLabel = null;
      }
      stateFixer.fix(jsonStateOld, JSON.stringify(stateNew));

      return stateNew;
    }
    case ACTIONS.types.WIZARD.ConfigureDdl.SelectFieldSlide.SELECT_FIELD: {
      const payload = action.payload;

      const wizardViewModel = graphTraversal.find(stateNew, payload.wizardViewId);

      wizardViewModel.selectedFieldId = payload.selectedFieldId;
      wizardViewModel.selectedFieldLabel = payload.selectedFieldLabel;

      stateFixer.fix(jsonStateOld, JSON.stringify(stateNew));

      return stateNew;
    }
    case ACTIONS.types.WIZARD.ConfigureDdl.SelectFieldSlide.SELECT_VALUE_FIELD: {
      const payload = action.payload;

      const viewModelWizard = graphTraversal.find(stateNew, payload.wizardViewId);

      viewModelWizard.dataValueId = viewModelWizard.slides.selectContainerFields.selectedFieldId;
      viewModelWizard.dataValueLabel = viewModelWizard.slides.selectContainerFields.selectedFieldLabel;

      stateFixer.fix(jsonStateOld, JSON.stringify(stateNew));

      return stateNew;
    }
    case ACTIONS.types.WIZARD.ConfigureDdl.SelectFieldSlide.SELECT_DISPLAY_FIELD: {
      const payload = action.payload;

      const viewModelWizard = graphTraversal.find(stateNew, payload.wizardViewId);

      viewModelWizard.dataTextId = viewModelWizard.slides.selectContainerFields.selectedFieldId;
      viewModelWizard.dataTextLabel = viewModelWizard.slides.selectContainerFields.selectedFieldLabel;

      stateFixer.fix(jsonStateOld, JSON.stringify(stateNew));

      return stateNew;
    }
    case ACTIONS.types.GRID.SHOW_GRID_DATA: {
      const payload = action.payload;
      const viewId = payload.viewId;
      const data = payload.data;

      const gridViewModel = graphTraversal.find(stateNew, viewId);

      gridViewModel.data.rows = data.rows;
      gridViewModel.data.columns = data.columns;
      gridViewModel.needsToMakeDataRequest = false;
      stateFixer.fix(jsonStateOld, JSON.stringify(stateNew));

      return stateNew;
    }
    case ACTIONS.types.GRID.ROW_SAVED: {
      const payload = action.payload;
      const viewId = payload.viewId;
      const allRowsSaved = payload.rowsSaved;

      const gridViewModel = graphTraversal.find(stateNew, viewId);

      gridViewModel.toolbar.addButtonDisabled = false;
      gridViewModel.data.rows = [].concat(gridViewModel.data.rows);

      allRowsSaved.forEach((rowSaved) => {
        const index = _.findIndex(gridViewModel.data.rows, (row) => (row.id === rowSaved.id));

        if (index > -1) {
          gridViewModel.data.rows[index] = rowSaved;
        } else {
          gridViewModel.data.rows.unshift(rowSaved);
          gridViewModel.selectedIndexes = gridViewModel.selectedIndexes.map((value) => {
            return value + 1;
          });
        }
      });

      stateFixer.fix(jsonStateOld, JSON.stringify(stateNew));

      return stateNew;
    }
    case ACTIONS.types.GRID.ROWS_DELETE: {
      const payload = action.payload;
      const viewId = payload.viewId;
      const idsToDelete = payload.ids;

      const gridViewModel = graphTraversal.find(stateNew, viewId);

      gridViewModel.data.rows.forEach((row, index) => {
        if (idsToDelete.includes(row.id)) {
          gridViewModel.selectedIndexes = gridViewModel.selectedIndexes.slice(index, 1);
        }
      });

      gridViewModel.data.rows = _.filter(gridViewModel.data.rows, (row) => {
        return !idsToDelete.includes(row.id);
      });

      stateFixer.fix(jsonStateOld, JSON.stringify(stateNew));

      return stateNew;
    }
    case ACTIONS.types.GRID.SELECT_ROW: {
      const payload = action.payload;
      const viewId = payload.viewId;
      const selectedIndexes = payload.selectedIndexes;

      const gridView = graphTraversal.find(stateNew, viewId);

      gridView.selectedIndexes = _.uniq(gridView.selectedIndexes.concat(selectedIndexes));

      stateFixer.fix(jsonStateOld, JSON.stringify(stateNew));

      return stateNew;
    }
    case ACTIONS.types.GRID.DESELECT_ROW: {
      const payload = action.payload;
      const viewId = payload.viewId;
      const deselectedIndexes = payload.deselectedIndexes;

      const gridView = graphTraversal.find(stateNew, viewId);

      gridView.selectedIndexes = _.filter(gridView.selectedIndexes, (selectedIndex) => {
        return !deselectedIndexes.includes(selectedIndex);
      });

      stateFixer.fix(jsonStateOld, JSON.stringify(stateNew));

      return stateNew;
    }
    case ACTIONS.types.GRID.SET_COLLECTION_ID: {
      const payload = action.payload;
      const viewId = payload.viewId;

      const gridView = graphTraversal.find(stateNew, viewId);

      gridView.data.collectionId = payload.collectionId;
      gridView.needsToMakeDataRequest = true;

      stateFixer.fix(jsonStateOld, JSON.stringify(stateNew));

      return stateNew;
    }
    default: {
      return state;
    }
  }
};

export default reducer;
