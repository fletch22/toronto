import _ from 'lodash';
import crudActionCreator from '../actions/crudActionCreator';
import ComponentService from '../service/component/componentService';
import graphTraversal from '../state/graphTraversal';
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
}

export default new CrudOperations();
