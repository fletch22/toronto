import viewModelFactory from '../../reducers/viewModelFactory';
import viewModelCreatorService from '../../service/viewModelCreatorService';

class ViewModelCreator {
  create(dispatch, model, parentViewId, successCallback) {
    const viewModel = viewModelFactory.generateViewModel(parentViewId, model);

    this.persistArrayOfChildren(dispatch, [viewModel], parentViewId, successCallback);
  }

  update(dispatch, viewModel, successCallback) {
    this.updateChildren(dispatch, [viewModel], viewModel.parentId, successCallback);
  }

  updateChildren(dispatch, viewModelChildren, parentViewId, successCallback) {
    this.persistArrayOfChildren(dispatch, viewModelChildren, parentViewId, successCallback);
  }

  persistArrayOfChildren(dispatch, viewModelChildren, parentViewId, successCallback) {
    viewModelCreatorService.createUpdateChildren(dispatch, parentViewId, viewModelChildren, successCallback);
  }
}

export default new ViewModelCreator();

