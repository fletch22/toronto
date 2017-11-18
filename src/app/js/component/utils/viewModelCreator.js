import viewModelFactory from '../../reducers/viewModelFactory';
import viewModelCreatorService from '../../service/viewModelCreatorService';

class ViewModelCreator {
  create(dispatch, model, parentViewId, successCallback, fnAdditionalStateMutator) {
    const viewModel = viewModelFactory.generateViewModel(parentViewId, model);

    this.persistArrayOfChildren(dispatch, [viewModel], parentViewId, successCallback, fnAdditionalStateMutator);
  }

  update(dispatch, viewModel, successCallback, fnAdditionalStateMutator) {
    this.updateChildren(dispatch, [viewModel], viewModel.parentId, successCallback, fnAdditionalStateMutator);
  }

  updateChildren(dispatch, viewModelChildren, parentViewId, successCallback, fnAdditionalStateMutator) {
    this.persistArrayOfChildren(dispatch, viewModelChildren, parentViewId, successCallback, fnAdditionalStateMutator);
  }

  persistArrayOfChildren(dispatch, viewModelChildren, parentViewId, successCallback, fnAdditionalStateMutator) {
    viewModelCreatorService.createUpdateChildren(dispatch, parentViewId, viewModelChildren, successCallback, fnAdditionalStateMutator);
  }
}

export default new ViewModelCreator();

