import actionComponentCreatorHandler from '../../reducers/actionComponentCreatorHandler';
import viewModelCreatorService from '../../service/viewModelCreatorService';

class ViewModelCreator {
  create(dispatch, model, parentViewId, successCallback) {
    const viewModel = actionComponentCreatorHandler.generateViewModel(parentViewId, model);

    this.persistArrayOfChildren(dispatch, [viewModel], parentViewId, successCallback);
  }

  update(dispatch, viewModel, parentViewId, successCallback) {
    this.updateChildren(dispatch, [viewModel], parentViewId, successCallback);
  }

  updateChildren(dispatch, viewModelChildren, parentViewId, successCallback) {
    this.persistArrayOfChildren(dispatch, viewModelChildren, parentViewId, successCallback);
  }

  persistArrayOfChildren(dispatch, viewModelChildren, parentViewId, successCallback) {
    viewModelCreatorService.createUpdateChildren(dispatch, parentViewId, viewModelChildren, successCallback);
  }
}

export default new ViewModelCreator();

