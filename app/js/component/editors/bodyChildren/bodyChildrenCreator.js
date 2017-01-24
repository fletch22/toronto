import _ from 'lodash';
import modalDispatcher from '../../modals/ModalDispatcher';
import crudActionCreator from '../../../actions/crudActionCreator';
import graphTraversal from '../../../state/graphTraversal';
import stateSyncService from '../../../service/stateSyncService';
import StatePackager from '../../../service/StatePackager';
import actionComponentCreator from '../../../reducers/actionComponentCreator';

class BodyChildrenCreator {

  constructor() {
    this.statePackager = new StatePackager();
  }

  createUpdate(dispatch, parentViewModelId, viewModel, successCallback) {
    const dispatchHelper = () => {
      const createUpdate = (cuDispatch, state) => {
        try {
          const stateParentViewModel = graphTraversal.find(state, parentViewModelId);
          const stateViewModel = _.find(stateParentViewModel.viewModel.children, { id: viewModel.id });
          if (stateViewModel) {
            Object.assign(stateViewModel, viewModel);
          } else {
            stateParentViewModel.viewModel.children.push(viewModel);
          }

          const model = actionComponentCreator.extractModelFromViewModel(viewModel);
          const parentModel = graphTraversal.find(state.model, model.parentId);
          const stateModel = _.find(parentModel.children, { id: model.id });
          if (stateModel) {
            Object.assign(stateModel, model);
          } else {
            parentModel.children.push(model);
          }

          const jsonStateOld = JSON.stringify(state);
          const stateNew = JSON.parse(jsonStateOld);

          const statePackage = this.statePackager.package(jsonStateOld, JSON.stringify(stateNew));
          return stateSyncService.saveState(statePackage)
            .then((result) => {
              console.debug('Success Callback.');
              return Promise.resolve(result);
            })
            .catch((error) => {
              console.debug('Failure Callback.');
              modalDispatcher.dispatchErrorModal(error, 'Encountered error while trying to create/update component.', cuDispatch);
              return Promise.reject(error);
            });
        } catch (error) {
          console.error(error);
          return Promise.reject(error);
        }
      };

      return crudActionCreator.invoke(createUpdate, successCallback);
    };

    dispatch(dispatchHelper());
  }
}

export default new BodyChildrenCreator();
