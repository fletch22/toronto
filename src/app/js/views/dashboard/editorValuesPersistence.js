import stateSyncService from '../../service/stateSyncService';
import webFolderModelFactory from '../../domain/component/webFolderModelFactory';
import graphTraversal from '../../../../common/state/graphTraversal';
import ViewModelCopyEditor from '../../component/editors/ViewModelCopyEditor';
import dashboardIslandViewFactory from '../DashboardIslandViewModelFactory';
import StatePackager from '../../service/StatePackager';
import ViewTypes from '../ViewTypes';
import stateTraversal from '../../state/stateTraversal';
import _ from 'lodash';

class EditorValuesPersistence {

  persist(dispatch, ownProps) {
    // Add or Update Model
    let model = ownProps.model;

    const callback = (state, jsonOldState) => {
      const parentModel = graphTraversal.find(state.model, model.parentId);

      if (!!model.id) {
        const actualModel = graphTraversal.find(state.model, model.id);
        for (const k in model) {
          if (model.hasOwnProperty(k)) {
            actualModel[k] = model[k];
          }
        }
      } else {
        model.id = stateTraversal.getNextId(state);
        model = webFolderModelFactory.createInstance(model);
        parentModel.children.push(model);
      }

      const viewModel = graphTraversal.find(state, ownProps.id);
      viewModel.model = model;

      const islandView = stateTraversal.findIslandWithId(state, model.parentId);

      dashboardIslandViewFactory.syncModelToViewModel(state, islandView);

      const statePackager = new StatePackager();
      const statePackage = statePackager.package(jsonOldState, JSON.stringify(state));
      return stateSyncService.saveState(statePackage)
        .then((result) => result.state);
    };
    return ViewModelCopyEditor.createUpdateNew(dispatch, callback, null);
  }
}

export default new EditorValuesPersistence();
