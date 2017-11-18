import ModalTypes from './ModalTypes';

class StandardModalDtoFactory {
  getInstance(headerText, bodyText, okAction) {
    return {
      headerText,
      bodyText,
      okAction,
      modalType: ModalTypes.StandardModal
    };
  }
}

export default new StandardModalDtoFactory();
