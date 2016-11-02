import ModalTypes from './ModalTypes';

class ErrorModalDtoFactory {
  getInstance(headerText, bodyText, okAction) {
    return {
      headerText,
      bodyText,
      okAction,
      modalType: ModalTypes.ErrorModal
    };
  }
}

export default ErrorModalDtoFactory;
