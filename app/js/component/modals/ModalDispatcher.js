import { actionShowErrorModal, actionHideCurrentModal } from '../../actions/index';
import { actionShowConfirm } from '../../actions/modal/index';

class ModalDispatcher {

  dispatchErrorModal(error, title, dispatch) {
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

  dispatchConfirmModal(dispatch, headerText, bodyText, yesAction, noAction, cancelAction) {
    dispatch(actionShowConfirm(headerText, bodyText, yesAction(), noAction(), cancelAction()));
  }
}

export default new ModalDispatcher();
