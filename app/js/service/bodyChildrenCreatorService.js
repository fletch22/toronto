import viewModelFactory from '../reducers/viewModelFactory';
import { actionSetCurrentBodyTool } from '../actions/bodyChildrenEditor/index';
import viewModelCreatorService from './viewModelCreatorService';

class BodyChildrenCreatorService {

  create(dispatch, model, parentViewId) {
    const viewModel = viewModelFactory.generateViewModel(parentViewId, model);

    this.persistArrayOfChildren(dispatch, [viewModel], parentViewId);
  }

  update(dispatch, viewModel, parentViewId) {
    this.updateChildren(dispatch, [viewModel], parentViewId);
  }

  updateChildren(dispatch, viewModelChildren, parentViewId) {
    this.persistArrayOfChildren(dispatch, viewModelChildren, parentViewId);
  }

  persistArrayOfChildren(dispatch, viewModelChildren, parentViewId) {
    const successCallback = () => {
      dispatch(actionSetCurrentBodyTool(parentViewId));
    };

    viewModelCreatorService.createUpdateChildren(dispatch, parentViewId, viewModelChildren, successCallback);
  }
}


export default new BodyChildrenCreatorService();
