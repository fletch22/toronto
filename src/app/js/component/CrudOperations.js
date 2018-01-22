import _ from 'lodash';
import crudActionCreator from '../actions/crudActionCreator';
import ComponentService from '../service/component/componentService';
import modalDispatcher from './modals/modalDispatcher';
import graphTraversal from '../state/graphTraversal';
import { actionSetState } from '../actions';
import stateSyncService from '../service/stateSyncService';
import StatePackager from '../service/StatePackager';

class CrudOperations {

  removeNode(viewModel) {
    const removeAppCallback = (dispatch, state) => {
      const stateNew = _.cloneDeep(state);

      const model = graphTraversal.find(stateNew.model, viewModel.viewModel.id);

      const viewModelActual = graphTraversal.find(stateNew, viewModel.id);
      if (!viewModelActual) {
        console.error('Could not find node to toggle header menu.');
        return stateNew;
      }
      viewModelActual.isShowingHeaderMenu = !viewModelActual.isShowingHeaderMenu;

      const componentService = new ComponentService();
      componentService.delete(stateNew, state, model.parentId, model.id);

      const statePackager = new StatePackager();
      const statePackage = statePackager.package(JSON.stringify(state), JSON.stringify(stateNew));
      return stateSyncService.saveState(statePackage)
        .then((result) => {
          return result.state;
        });
    };

    return crudActionCreator.invoke(removeAppCallback);
  }

  // updateProperty(component, property, newPropertyValue) {
  //   const changeLabelCallback = (dispatch, state) => {
  //     const jsonStateOld = JSON.stringify(state);
  //     const stateNew = JSON.parse(jsonStateOld);
  //
  //     const componentService = new ComponentService();
  //     const promise = componentService.update(stateNew, jsonStateOld, component.id, property, newPropertyValue);
  //
  //     promise.catch((error) => {
  //       modalDispatcher.dispatchErrorModal(error, `There was an error updating the ${component.typeLabel} object.`, dispatch);
  //     });
  //
  //     return promise;
  //   };
  //
  //   return crudActionCreator.invoke(changeLabelCallback);
  // }
}

export default new CrudOperations();
