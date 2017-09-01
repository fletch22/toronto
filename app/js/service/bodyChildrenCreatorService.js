import viewModelFactory from '../reducers/viewModelFactory';
import { actionSetCurrentBodyTool } from '../actions/bodyChildrenEditor/index';
import viewModelCreatorService from './viewModelCreatorService';

class BodyChildrenCreatorService {

  create(dispatch, model, parentViewId, fnAdditionalStateMutator) {
    const viewModel = viewModelFactory.generateViewModel(parentViewId, model);

    this.persistArrayOfChildren(dispatch, [viewModel], parentViewId, fnAdditionalStateMutator);
  }

  update(dispatch, viewModel, parentViewId, fnAdditionalStateMutator) {
    this.updateChildren(dispatch, [viewModel], parentViewId, fnAdditionalStateMutator);
  }

  updateChildren(dispatch, viewModelChildren, parentViewId, fnAdditionalStateMutator) {
    this.persistArrayOfChildren(dispatch, viewModelChildren, parentViewId, fnAdditionalStateMutator);
  }

  persistArrayOfChildren(dispatch, viewModelChildren, parentViewId, fnAdditionalStateMutator) {
    const successCallback = () => {
      dispatch(actionSetCurrentBodyTool(parentViewId));
    };

    viewModelCreatorService.createUpdateChildren(dispatch, parentViewId, viewModelChildren, successCallback, fnAdditionalStateMutator);
  }
}


export default new BodyChildrenCreatorService();
