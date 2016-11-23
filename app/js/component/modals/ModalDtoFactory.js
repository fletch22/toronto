import ModalTypes from './ModalTypes';
import f22Uuid from '../../util/f22Uuid';

class ModalDtoFactory {

  getCore(modalType) {
    return {
      id: f22Uuid.generate(),
      modalType
    };
  }

  getFormModalInstance(properties) {
    return Object.assign(this.getCore(ModalTypes.FormModal), properties);
  }

  getPseudoModalInstance(properties) {
    return Object.assign(this.getCore(ModalTypes.PseudoModal), properties);
  }
}

export default new ModalDtoFactory();
