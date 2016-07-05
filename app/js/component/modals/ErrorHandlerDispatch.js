import { actionShowErrorModal, actionHideCurrentModal } from '../../actions/index';

class ErrorHandlerDispatch {

  handle(error, title, dispatch) {
    const errorModalDto = {
      headerText: error.name,
      bodyText: error.message
    };

    if (typeof error.responseObject === 'object') {
      errorModalDto.headerText = title;
      errorModalDto.bodyText = error.responseObject.systemMessage;
    }

    const okAction = actionHideCurrentModal();
    dispatch(actionShowErrorModal(errorModalDto.headerText, errorModalDto.bodyText, okAction));
  }
}

export default new ErrorHandlerDispatch();
