import actionComponentCreatorHandler from '../../reducers/actionComponentCreatorHandler';
import { actionSetCurrentBodyTool } from '../../actions/bodyChildrenEditor/index';
import bodyChildrenCreator from '../../component/editors/bodyChildren/bodyChildrenCreator';

class ViewModelCreator {
  create(dispatch, model, parentViewId) {
    const viewModel = actionComponentCreatorHandler.generateViewModel(parentViewId, model);

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
      dispatch(actionSetCurrentBodyTool(parentViewId.id));
    };

    bodyChildrenCreator.createUpdateChildren(dispatch, parentViewId, viewModelChildren, successCallback);
  }
}

export default new ViewModelCreator();

