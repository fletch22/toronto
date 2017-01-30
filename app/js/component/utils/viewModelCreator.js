import actionComponentCreatorHandler from '../../reducers/actionComponentCreatorHandler';
import { actionSetCurrentBodyTool } from '../../actions/bodyChildrenEditor/index';
import bodyChildrenCreator from '../../component/editors/bodyChildren/bodyChildrenCreator';

class ViewModelCreator {
  create(dispatch, model, parentViewId) {
    const viewModel = actionComponentCreatorHandler.generateViewModel(parentViewId, model);

    const successCallback = () => {
      dispatch(actionSetCurrentBodyTool(viewModel.id));
    };

    bodyChildrenCreator.createUpdate(dispatch, parentViewId, viewModel, successCallback);
  }

  update(dispatch, viewModel, parentViewId) {
    const successCallback = () => {
      dispatch(actionSetCurrentBodyTool(viewModel.id));
    };

    bodyChildrenCreator.createUpdate(dispatch, parentViewId, viewModel, successCallback);
  }
}

export default new ViewModelCreator();

