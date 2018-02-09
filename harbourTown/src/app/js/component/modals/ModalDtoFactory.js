import ModalTypes from './ModalTypes';
import f22Uuid from '../../../../common/util/f22Uuid';

class ModalDtoFactory {

  getCore(modalType) {
    return {
      id: f22Uuid.generate(),
      modalType
    };
  }

  getPseudoModalInstance(component) {
    return Object.assign(this.getCore(ModalTypes.PseudoModal), component);
  }
}

export default new ModalDtoFactory();
